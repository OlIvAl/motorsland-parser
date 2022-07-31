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
  ITableCatalogLink,
  IUploadingTableClient,
  IWatermarkSettings,
} from "./interfases";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

export class UploadingTableClient implements IUploadingTableClient {
  private catalogLinksTableClient: TableClient;
  private watermarkSettingsTableClient: TableClient;
  private sourceTableClient: TableClient;
  private fieldTableClient: TableClient;

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
  async setFields(
    uploading: UPLOADING_NAME,
    fields: Record<string, string>
  ): Promise<void> {
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

  async getSources(source: string): Promise<ISource> {
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
      preVendorCode: sourceObj.preVendorCode,
      site: sourceObj.site,
      markup: sourceObj.markup,
      exchangeRate: sourceObj.exchangeRate,
      imagesXPath: sourceObj.imagesXPath,
      disabled: sourceObj.disabled,
      linkListUrls: [],
      fields: [],
      watermarkSettings: undefined,
    };
  }
}
