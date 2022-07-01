import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import { UPLOADING_NAME } from "../constants";
import {
  ISource,
  ITableField,
  ITableWatermarkSettings,
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
  private watermarkSettingsTableClient: TableClient;
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
    this.watermarkSettingsTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "watermarkSettings",
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

  async getUploadingSources(uploading: UPLOADING_NAME): Promise<ISource[]> {
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
      // ToDo: оптимизировать!!!
      const [fieldRows, watermarkSettingsRows] = await Promise.all([
        this.uploadingFieldSourceTableClient.listEntities<ITableUploadingFieldSource>(
          {
            queryOptions: {
              filter: odata`uploading eq ${uploading} and source eq ${uploadingSource.rowKey}`,
            },
          }
        ),
        this.watermarkSettingsTableClient.listEntities<ITableWatermarkSettings>(
          {
            queryOptions: {
              filter: odata`source eq ${uploadingSource.rowKey}`,
            },
          }
        ),
      ]);

      const watermarkSettings: ITableWatermarkSettings = (
        await watermarkSettingsRows.next()
      ).value;

      item = {
        name: uploadingSource.rowKey as string,
        linkListUrl: uploadingSource.linkListUrl,
        lastPageXpath: source.lastPageXpath,
        nextPageXpath: source.nextPageXpath,
        linkXpath: source.linkXpath,
        listPageExpression: source.listPageExpression,
        preVendorCode: source.preVendorCode,
        site: source.site,
        markup: source.markup,
        exchangeRate: source.exchangeRate,
        fields: [],
        imagesXPath: source.imagesXPath,
        watermarkSettings: watermarkSettings.watermark
          ? {
              watermarkScale: watermarkSettings.watermarkScale,
              position: watermarkSettings.position,
            }
          : undefined,
        disabled: source.disabled,
      };

      for await (const field of fieldRows) {
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
