import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { INewItemsCountTableClient } from "./interfases";
import { CONTAINER_NAME } from "../constants";

export class NewItemsCountTableClient implements INewItemsCountTableClient {
  private static AZURE_ACCOUNT = "motorsland";
  private static AZURE_ACCOUNT_KEY =
    "hW0Z3QW5iJPyKFrJJR4h8sZZu5JsMC8td2ulQel9+Fv0RCzueNpsPCDbp+eDFgdDAMdi9VbC1g8z++mHsXYaDw==";

  private tableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      NewItemsCountTableClient.AZURE_ACCOUNT,
      NewItemsCountTableClient.AZURE_ACCOUNT_KEY
    );

    this.tableClient = new TableClient(
      `https://${NewItemsCountTableClient.AZURE_ACCOUNT}.table.core.windows.net`,
      "newItemsCount",
      credential
    );
  }

  async getNewItemsCount(storage: CONTAINER_NAME): Promise<number> {
    return (
      await this.tableClient.getEntity<{ count: number }>(
        "newItemsCount",
        storage
      )
    ).count;
  }
  async setNewItemsCount(
    storage: CONTAINER_NAME,
    count: number
  ): Promise<void> {
    await this.tableClient.updateEntity({
      partitionKey: "newItemsCount",
      rowKey: storage,
      count,
    });
  }
}
