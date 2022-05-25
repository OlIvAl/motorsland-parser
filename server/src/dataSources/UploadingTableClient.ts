import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import { UPLOADING_NAME } from "../constants";
import {
  ISource,
  ITableSource,
  IUploadingItem,
  IUploadingSource,
  IUploadingTableClient,
} from "./interfases";

export class UploadingTableClient implements IUploadingTableClient {
  private tableClient: TableClient;
  private uploadingSourceTableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.tableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploading",
      credential
    );
    this.uploadingSourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "uploadingSource",
      credential
    );
  }

  async getProgress(uploading: UPLOADING_NAME): Promise<boolean> {
    return (
      await this.tableClient.getEntity<IUploadingItem>("uploading", uploading)
    ).progress;
  }
  async setProgress(uploading: UPLOADING_NAME): Promise<void> {
    await this.tableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        progress: true,
      },
      "Merge"
    );
  }
  async unsetProgress(uploading: UPLOADING_NAME): Promise<void> {
    await this.tableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        progress: false,
      },
      "Merge"
    );
  }
  async isAnyInProgress(): Promise<boolean> {
    const result = await this.tableClient.listEntities<IUploadingItem>({
      queryOptions: { filter: odata`progress eq true` },
    });

    let arr = [];

    for await (const item of result) {
      arr.push(item);
    }

    return Boolean(arr.length);
  }
  async getNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    return (
      await this.tableClient.getEntity<IUploadingItem>("uploading", uploading)
    ).newDocumentsCount;
  }
  async setNewDocumentsCount(
    uploading: UPLOADING_NAME,
    count: number
  ): Promise<void> {
    await this.tableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        newDocumentsCount: count,
      },
      "Merge"
    );
  }
  async getFields(uploading: UPLOADING_NAME): Promise<Record<string, string>> {
    return JSON.parse(
      (await this.tableClient.getEntity<IUploadingItem>("uploading", uploading))
        .fields
    ) as Record<string, string>;
  }
  async setFields(
    uploading: UPLOADING_NAME,
    fields: Record<string, string>
  ): Promise<void> {
    await this.tableClient.updateEntity<Partial<IUploadingItem>>(
      {
        partitionKey: "uploading",
        rowKey: uploading,
        fields: JSON.stringify(fields),
      },
      "Merge"
    );
  }

  async getSources(uploading: UPLOADING_NAME): Promise<ISource[]> {
    const tableSource: ITableSource[] = JSON.parse(
      (
        await this.tableClient.getEntity<{
          sources: string;
        }>("uploading", uploading)
      ).sources
    );

    let sources: ISource[] = [];

    for (let i = 0; i < tableSource.length; i++) {
      const uploadingSource =
        await this.uploadingSourceTableClient.getEntity<IUploadingSource>(
          "uploadingSource",
          tableSource[i].uploadingId
        );
      sources.push({ ...tableSource[i], ...{ site: uploadingSource.site } });
    }

    return sources;
  }
}
