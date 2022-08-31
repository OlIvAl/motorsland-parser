import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import {
  ITableField,
  ITableWatermarkSettings,
  ITableSource,
  ITableCatalogLink,
  IUploadingTableClient,
  IWatermarkSettings,
  IFieldSelector,
  ITableUploadingFieldSource,
  IListSource,
} from "./interfases";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

export class UploadingTableClient implements IUploadingTableClient {
  private catalogLinksTableClient: TableClient;
  private watermarkSettingsTableClient: TableClient;
  private sourceTableClient: TableClient;
  private fieldTableClient: TableClient;
  private fieldSourceTableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.catalogLinksTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "catalogLinks",
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
    this.fieldTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "field",
      credential
    );
    this.fieldSourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "fieldSource",
      credential
    );
  }

  async getList(): Promise<IUploading[]> {
    const uploadings: any[] = [];

    let result: IUploading[] = [];

    for (const uploading of uploadings) {
      result.push({
        id: uploading.name,
        name: uploading.name,
        newDocumentsCount: uploading.newDocumentsCount,
        progress: uploading.progress,
      });
    }

    return result;
  }

  async getFields(): Promise<ITableField[]> {
    const fieldRows = await this.fieldTableClient.listEntities<ITableField>();

    let result: ITableField[] = [];
    for await (const fieldRow of fieldRows) {
      result.push({
        field: fieldRow.field,
        title: fieldRow.title,
      });
    }

    return result;
  }
  async getFieldSelectorsBySource(source: string): Promise<IFieldSelector[]> {
    const fieldRows =
      await this.fieldSourceTableClient.listEntities<ITableUploadingFieldSource>(
        {
          queryOptions: {
            filter: odata`source eq ${source}`,
          },
        }
      );

    let result: IFieldSelector[] = [];
    for await (const fieldRow of fieldRows) {
      result.push({
        field: fieldRow.field,
        xpaths: fieldRow.xpaths,
        regexps: fieldRow.regexps,
        cleanRegexps: fieldRow.cleanRegexps,
        value: fieldRow.value,
      });
    }

    return result;
  }
  async setFields(fields: Record<string, string>): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getLinks(source: string): Promise<string[]> {
    const catalogLinksRows =
      await this.catalogLinksTableClient.listEntities<ITableCatalogLink>({
        queryOptions: { filter: odata`RowKey eq ${source}` },
      });

    const links = [];

    for await (const catalogLinksRow of catalogLinksRows) {
      links.push(catalogLinksRow.linkListUrl);
    }

    return links;
  }
  async getWatermarkSettings(
    source: string
  ): Promise<IWatermarkSettings | undefined> {
    const watermarkSettingsRows =
      this.watermarkSettingsTableClient.listEntities<ITableWatermarkSettings>({
        queryOptions: {
          filter: odata`source eq ${source}`,
        },
      });

    const watermarkSettings: ITableWatermarkSettings = (
      await watermarkSettingsRows.next()
    ).value;

    return watermarkSettings.watermark
      ? {
          watermarkScale: watermarkSettings.watermarkScale,
          position: watermarkSettings.position,
        }
      : undefined;
  }

  async getListSource(source: string): Promise<IListSource> {
    const sourceObj = await this.sourceTableClient.getEntity<ITableSource>(
      "uploadingSource",
      source
    );

    return {
      name: sourceObj.rowKey as string,
      lastPageXpath: sourceObj.lastPageXpath,
      nextPageXpath: sourceObj.nextPageXpath,
      linkXpath: sourceObj.linkXpath,
      listPageExpression: sourceObj.listPageExpression,
      site: sourceObj.site,
    };
  }
}
