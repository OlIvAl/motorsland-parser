import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { INewDocumentsCountTableClient } from "./interfases";
import { CONTAINER_NAME } from "../constants";

export class NewDocumentsCountTableClient
  implements INewDocumentsCountTableClient
{
  private tableClient: TableClient;
  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.tableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
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
