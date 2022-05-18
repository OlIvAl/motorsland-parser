import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
} from "@azure/data-tables";
import { IProgressTableClient } from "./interfases";
import { CONTAINER_NAME } from "../constants";

export class ProgressTableClient implements IProgressTableClient {
  private tableClient: TableClient;
  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.tableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "progress",
      credential
    );
  }

  async getProgress(storage: CONTAINER_NAME): Promise<boolean> {
    return (
      await this.tableClient.getEntity<{ progress: boolean }>(
        "progress",
        storage
      )
    ).progress;
  }
  async setProgress(storage: CONTAINER_NAME): Promise<void> {
    await this.tableClient.updateEntity<{ progress: boolean }>({
      partitionKey: "progress",
      rowKey: storage,
      progress: true,
    });
  }
  async unsetProgress(storage: CONTAINER_NAME): Promise<void> {
    await this.tableClient.updateEntity<{ progress: boolean }>({
      partitionKey: "progress",
      rowKey: storage,
      progress: false,
    });
  }
  async isAnyInProgress(): Promise<boolean> {
    const result = await this.tableClient.listEntities<{ progress: boolean }>({
      queryOptions: { filter: odata`progress eq true` },
    });

    let arr = [];

    for await (const item of result) {
      arr.push(item);
    }

    return Boolean(arr.length);
  }
}
