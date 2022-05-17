import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { INewDocumentsCountTableClient } from "./interfases";
import { CONTAINER_NAME } from "../constants";

export class NewDocumentsCountTableClient
  implements INewDocumentsCountTableClient
{
  private static AZURE_ACCOUNT = "motorsland";
  private static AZURE_ACCOUNT_KEY =
    "hW0Z3QW5iJPyKFrJJR4h8sZZu5JsMC8td2ulQel9+Fv0RCzueNpsPCDbp+eDFgdDAMdi9VbC1g8z++mHsXYaDw==";

  private tableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      NewDocumentsCountTableClient.AZURE_ACCOUNT,
      NewDocumentsCountTableClient.AZURE_ACCOUNT_KEY
    );

    this.tableClient = new TableClient(
      `https://${NewDocumentsCountTableClient.AZURE_ACCOUNT}.table.core.windows.net`,
      "newItemsCount",
      credential
    );
  }

  async getNewDocumentsCount(storage: CONTAINER_NAME): Promise<number> {
    return (
      await this.tableClient.getEntity<{ count: number }>(
        "newItemsCount",
        storage
      )
    ).count;
  }
  async setNewDocumentsCount(
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
