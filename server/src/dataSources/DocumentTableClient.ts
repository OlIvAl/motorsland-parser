import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import { BlobClient } from "@azure/storage-blob";
import { CONTAINER_NAME, UPLOADING_NAME } from "../constants";
import {
  IAzureBlobStorage,
  IDocumentInfo,
  IDocumentTableClient,
  IFieldData,
  IItemData,
  ITableDocumentField,
  ITableImage,
} from "./interfases";

export class DocumentTableClient implements IDocumentTableClient {
  private documentTableClient: TableClient;
  private documentFieldTableClient: TableClient;
  private imagesTableClient: TableClient;

  constructor(private imagesStorage: IAzureBlobStorage) {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.documentTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "document",
      credential
    );
    this.documentFieldTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "documentField",
      credential
    );
    this.imagesTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "images",
      credential
    );
  }

  async get(name: string): Promise<ITableDocumentField[][]> {
    const result =
      await this.documentFieldTableClient.listEntities<ITableDocumentField>({
        queryOptions: { filter: odata`document eq ${name}` },
      });

    let acc: Record<string, ITableDocumentField[]> = {};

    // Separate by vendor code
    for await (const item of result) {
      if ((item.partitionKey as string) in acc) {
        acc[item.partitionKey as string] = [
          ...acc[item.partitionKey as string],
          item,
        ];
      } else {
        acc[item.partitionKey as string] = [item];
      }
    }

    return Object.values<ITableDocumentField[]>(acc);
  }
  async getPagePublicImages(vcId: string): Promise<string[]> {
    const result = await this.imagesTableClient.listEntities<ITableImage>({
      queryOptions: { filter: odata`PartitionKey eq ${vcId}` },
    });

    let arr: string[] = [];

    for await (const item of result) {
      arr.push(item.name);
    }

    return await Promise.all(
      arr.map((name) => this.imagesStorage.getPublicURL(name))
    );
  }
  async getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]> {
    const result = await this.documentTableClient.listEntities<{}>({
      queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
    });

    let arr = [];

    for await (const item of result) {
      arr.push({
        name: item.rowKey as string,
        createdOn: new Date(item.timestamp as string),
      });
    }

    return arr;
  }
  async getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo | null> {
    const result = await this.documentTableClient.listEntities<{}>({
      queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
    });

    // for await (item of result) {}

    let arr = [];

    for await (const item of result) {
      arr.push(item);
    }

    if (!arr.length) {
      return null;
    }

    const lastItem = arr[arr.length - 1];

    return {
      name: lastItem.rowKey as string,
      createdOn: new Date(lastItem.timestamp as string),
    };
  }
  async addDocument(
    uploading: UPLOADING_NAME,
    document: IItemData[]
  ): Promise<IDocumentInfo> {
    const fileName = `${uploading}-${new Date().toISOString()}`;

    const dataFromPages: IFieldData[][] = document.map((itemData) => {
      const { images, ...info } = itemData;

      return Object.entries(info).map(([key, value]) => ({
        name: key,
        value,
      }));
    });

    for (const item of document) {
      await Promise.all(
        item.images.map((src) => {
          const name = (src.match(/\d+\/[\d\w_]+.jpg$/g) as string[])[0];
          return this.imagesTableClient.createEntity<ITableImage>({
            partitionKey: item.vendor_code,
            rowKey: encodeURIComponent(name),
            url: src,
            name: name,
            document: fileName,
          });
        })
      );
    }
    for (const data of dataFromPages) {
      await Promise.all(
        data.map((field) => {
          const vendorCodeIndex = data.findIndex(
            (field) => field.name === "vendor_code"
          ) as number;
          const vendorCode = data[vendorCodeIndex].value as string;

          return this.documentFieldTableClient.createEntity<ITableDocumentField>(
            {
              partitionKey: vendorCode,
              rowKey: field.name,
              name: field.name,
              value: field.value,
              document: fileName,
            }
          );
        })
      );
    }

    const createDocumentResponse =
      await this.documentTableClient.createEntity<{}>({
        partitionKey: uploading,
        rowKey: fileName,
      });

    return {
      name: fileName,
      createdOn: createDocumentResponse.date,
    };
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    const [imagesSelectResult, documentFieldsSelectResult] = await Promise.all([
      this.imagesTableClient.listEntities<ITableImage>({
        queryOptions: { filter: odata`document eq ${name}` },
      }),
      this.documentFieldTableClient.listEntities<ITableDocumentField>({
        queryOptions: { filter: odata`document eq ${name}` },
      }),
    ]);

    let names: string[] = [];
    let imagesKeysPairs: { partitionKey: string; rowKey: string }[] = [];
    for await (const item of imagesSelectResult) {
      names.push(item.name as string);
      imagesKeysPairs.push({
        partitionKey: item.partitionKey as string,
        rowKey: item.rowKey as string,
      });
    }

    let documentFieldsKeysPairs: { partitionKey: string; rowKey: string }[] =
      [];
    for await (const item of documentFieldsSelectResult) {
      documentFieldsKeysPairs.push({
        partitionKey: item.partitionKey as string,
        rowKey: item.rowKey as string,
      });
    }

    const blobClients = names.map(
      (name) =>
        new BlobClient(
          process.env.AZURE_STORAGE_CONNECTION_STRING as string,
          CONTAINER_NAME.IMAGES_CONTAINER_NAME,
          name
        )
    );

    await this.imagesStorage.deleteBlobs(blobClients);

    await Promise.all([
      this.documentTableClient.deleteEntity(uploading, name),
      this.imagesStorage.deleteBlobs(blobClients),
      ...documentFieldsKeysPairs.map((keysPair) =>
        this.documentFieldTableClient.deleteEntity(
          keysPair.partitionKey,
          keysPair.rowKey
        )
      ),
      ...imagesKeysPairs.map((keysPair) =>
        this.imagesTableClient.deleteEntity(
          keysPair.partitionKey,
          keysPair.rowKey
        )
      ),
    ]);
  }
}
