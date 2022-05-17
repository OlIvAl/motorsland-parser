import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { IProgressTableClient } from "./interfases";
import { CONTAINER_NAME } from "../constants";

export class ProgressTableClient implements IProgressTableClient {
  private static AZURE_ACCOUNT = "motorsland";
  private static AZURE_ACCOUNT_KEY =
    "hW0Z3QW5iJPyKFrJJR4h8sZZu5JsMC8td2ulQel9+Fv0RCzueNpsPCDbp+eDFgdDAMdi9VbC1g8z++mHsXYaDw==";

  private tableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      ProgressTableClient.AZURE_ACCOUNT,
      ProgressTableClient.AZURE_ACCOUNT_KEY
    );

    this.tableClient = new TableClient(
      `https://${ProgressTableClient.AZURE_ACCOUNT}.table.core.windows.net`,
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
    await this.tableClient.createEntity({
      partitionKey: "progress",
      rowKey: storage,
      progress: true,
    });
  }
  async unsetProgress(storage: CONTAINER_NAME): Promise<void> {
    await this.tableClient.createEntity({
      partitionKey: "progress",
      rowKey: storage,
      progress: false,
    });
  }
}
