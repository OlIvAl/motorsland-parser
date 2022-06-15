import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import { UPLOADING_NAME } from "../constants";
import {
  ISource,
  ITableField,
  ITableSource,
  ITableUploadingFieldRelation,
  ITableUploadingFieldSource,
  ITableUploadingSource,
  IUploadingItem,
  IUploadingTableClient,
} from "./interfases";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

export class UploadingTableClient implements IUploadingTableClient {
  private uploadingTableClient: TableClient;
  private uploadingSourceTableClient: TableClient;
  private uploadingFieldSourceTableClient: TableClient;
  private uploadingFieldRelationTableClient: TableClient;
  private sourceTableClient: TableClient;
  private fieldTableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.uploadingTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploading",
      credential
    );
    this.uploadingSourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploadingSource",
      credential
    );
    this.sourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "source",
      credential
    );
    this.uploadingFieldSourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploadingFieldSource",
      credential
    );
    this.uploadingFieldRelationTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploadingFieldRelation",
      credential
    );
    this.fieldTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "field",
      credential
    );
  }

  async getList(): Promise<IUploading[]> {
    const uploadings =
      await this.uploadingTableClient.listEntities<IUploading>();

    let result: IUploading[] = [];

    for await (const uploading of uploadings) {
      result.push({
        id: uploading.name,
        name: uploading.name,
        newDocumentsCount: uploading.newDocumentsCount,
        progress: uploading.progress,
      });
    }

    return result;
  }

  async getProgress(uploading: UPLOADING_NAME): Promise<boolean> {
    return (
      await this.uploadingTableClient.getEntity<IUploadingItem>(
        "uploading",
        uploading
      )
    ).progress;
  }
  async setProgress(uploading: UPLOADING_NAME): Promise<void> {
    await this.uploadingTableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        progress: true,
      },
      "Merge"
    );
  }
  async unsetProgress(uploading: UPLOADING_NAME): Promise<void> {
    await this.uploadingTableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        progress: false,
      },
      "Merge"
    );
  }
  async isAnyInProgress(): Promise<boolean> {
    const result = await this.uploadingTableClient.listEntities<IUploadingItem>(
      {
        queryOptions: { filter: odata`progress eq true` },
      }
    );

    let arr = [];

    for await (const item of result) {
      arr.push(item);
    }

    return Boolean(arr.length);
  }
  async getNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    return (
      await this.uploadingTableClient.getEntity<IUploadingItem>(
        "uploading",
        uploading
      )
    ).newDocumentsCount;
  }
  async setNewDocumentsCount(
    uploading: UPLOADING_NAME,
    count: number
  ): Promise<void> {
    await this.uploadingTableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        newDocumentsCount: count,
      },
      "Merge"
    );
  }
  async getFields(uploading: UPLOADING_NAME): Promise<ITableField[]> {
    const fieldRelations =
      await this.uploadingFieldRelationTableClient.listEntities<ITableUploadingFieldRelation>(
        {
          queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
        }
      );

    let result: ITableField[] = [];
    for await (const fieldRelation of fieldRelations) {
      const field = await this.fieldTableClient.getEntity<ITableField>(
        "",
        fieldRelation.field
      );

      result.push({
        field: field.field,
        title: field.title,
      });
    }

    return result;
  }
  async setFields(
    uploading: UPLOADING_NAME,
    fields: Record<string, string>
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getSources(uploading: UPLOADING_NAME): Promise<ISource[]> {
    const uploadingSources =
      await this.uploadingSourceTableClient.listEntities<ITableUploadingSource>(
        {
          queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
        }
      );

    let result: ISource[] = [];
    for await (const uploadingSource of uploadingSources) {
      let item: ISource;
      const source = await this.sourceTableClient.getEntity<ITableSource>(
        "uploadingSource",
        uploadingSource.rowKey as string
      );
      const fields =
        await this.uploadingFieldSourceTableClient.listEntities<ITableUploadingFieldSource>(
          {
            queryOptions: {
              filter: odata`PartitionKey eq ${uploading} and source eq ${uploadingSource.rowKey}`,
            },
          }
        );

      item = {
        linkListUrl: uploadingSource.linkListUrl,
        imagesXPath: uploadingSource.imagesXPath,
        lastPageXpath: source.lastPageXpath,
        linkXpath: source.linkXpath,
        listPageExpression: source.listPageExpression,
        preVendorCode: source.preVendorCode,
        site: source.site,
        fields: [],
      };

      for await (const field of fields) {
        item.fields.push({
          field: field.field,
          xpath: field.xpath,
          cleanRegexp: field.cleanRegexp,
        });
      }
      result.push(item);
    }
    return result;
  }
}
