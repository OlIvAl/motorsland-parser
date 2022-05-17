import { IAzureBlobStorage, IDocumentInfo } from "./interfases";
import {
  BlobBatchClient,
  BlobClient,
  BlobSASPermissions,
  BlobServiceClient,
  BlobUploadCommonResponse,
  ContainerClient,
} from "@azure/storage-blob";

export class AzureBlobStorage implements IAzureBlobStorage {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private containerBatchClient: BlobBatchClient;

  static AZURE_STORAGE_CONNECTION_STRING =
    "DefaultEndpointsProtocol=https;AccountName=motorsland;AccountKey=hW0Z3QW5iJPyKFrJJR4h8sZZu5JsMC8td2ulQel9+Fv0RCzueNpsPCDbp+eDFgdDAMdi9VbC1g8z++mHsXYaDw==;EndpointSuffix=core.windows.net";

  constructor(private containerName: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      AzureBlobStorage.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    this.containerBatchClient = this.blobServiceClient.getBlobBatchClient();

    if (!this.containerClient.exists()) {
      throw Error("Container client is not exists!");
    }
  }

  async init(): Promise<void> {
    await this.blobServiceClient.setProperties({
      cors: [
        {
          allowedOrigins: "*",
          allowedMethods: "GET",
          allowedHeaders: "*",
          exposedHeaders: "*",
          maxAgeInSeconds: 1800,
        },
      ],
    });

    await this.containerClient.createIfNotExists();
  }
  async upload(
    buffer: Buffer,
    name: string,
    mimeType: string
  ): Promise<BlobUploadCommonResponse> {
    return await this.containerClient
      .getBlockBlobClient(name)
      .uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: mimeType,
        },
      });
  }
  async deleteBlob(name: string): Promise<void> {
    await this.containerClient.deleteBlob(name);
  }
  async deleteBlobs(blobClients: BlobClient[]): Promise<void> {
    function chunk<T>(arr: T[], size: number): T[][] {
      const result = [];

      for (let i = 0; i < Math.ceil(arr.length / size); i++) {
        result.push(arr.slice(i * size, i * size + size));
      }

      return result;
    }
    const chunkedArr = chunk<BlobClient>(blobClients, 250);

    for (let i = 0; i < chunkedArr.length; i++) {
      await this.containerBatchClient.deleteBlobs(chunkedArr[i]);
    }
  }
  async getPublicURL(name: string): Promise<string> {
    return await this.containerClient.getBlockBlobClient(name).generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(Date.now() - 300 * 1000),
      expiresOn: new Date(Date.now() + 3600 * 24 * 7 * 30 * 1000),
    });
  }
  async getItemsList(): Promise<IDocumentInfo[]> {
    let result: IDocumentInfo[] = [];

    for await (const blob of this.containerClient.listBlobsFlat()) {
      const publicURL = await this.getPublicURL(blob.name);
      result.push({
        name: blob.name,
        createdOn: blob.properties.createdOn as Date,
        publicURL,
      });
    }

    return result;
  }
  async getBuffer(name: string): Promise<Buffer> {
    return await this.containerClient
      .getBlockBlobClient(name)
      .downloadToBuffer(0);
  }
}