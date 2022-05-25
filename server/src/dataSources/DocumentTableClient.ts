import {
  IAzureBlobStorage,
  IDocumentInfo,
  IDocumentTableClient,
  IItemData,
} from "./interfases";
import { CONTAINER_NAME, UPLOADING_NAME } from "../constants";
import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
  TableEntityResult,
} from "@azure/data-tables";
import { BlobClient } from "@azure/storage-blob";

export class DocumentTableClient implements IDocumentTableClient {
  private tableClient: TableClient;

  constructor(
    private documentsStorage: IAzureBlobStorage,
    private imagesStorage: IAzureBlobStorage
  ) {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.tableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "document",
      credential
    );
  }

  async getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]> {
    const result = await this.tableClient.listEntities<{}>({
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
  async getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo> {
    const result = await this.tableClient.listEntities<{}>({
      queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
    });

    let item: TableEntityResult<{}> = {
      partitionKey: "",
      rowKey: "",
      etag: "",
    };

    for await (item of result) {
    }

    return {
      name: item.rowKey as string,
      createdOn: new Date(item.timestamp as string),
    };
  }
  async add(
    uploading: UPLOADING_NAME,
    json: IItemData[]
  ): Promise<IDocumentInfo> {
    const fileName = `${uploading}-${new Date().toISOString()}`;
    await this.documentsStorage.upload(
      Buffer.from(JSON.stringify(json)),
      fileName,
      "application/json"
    );

    const createTableEntityResponse = await this.tableClient.createEntity<{}>({
      partitionKey: uploading,
      rowKey: fileName,
    });

    return {
      name: fileName,
      createdOn: createTableEntityResponse.date,
    };
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    const document: IItemData[] = JSON.parse(
      (await this.documentsStorage.getBuffer(name as string)).toString()
    );

    const blobClients = document
      .reduce<string[]>((arr, item) => [...arr, ...item.images], [])
      .map(
        (name) =>
          new BlobClient(
            process.env.AZURE_STORAGE_CONNECTION_STRING as string,
            CONTAINER_NAME.IMAGES_CONTAINER_NAME,
            name
          )
      );

    await Promise.all([
      this.tableClient.deleteEntity(uploading, name),
      this.imagesStorage.deleteBlobs(blobClients),
      this.documentsStorage.deleteBlob(name),
    ]);

    // await this.updateNewDocumentsCount();
  }
}
