import { IAzureBlobStorage } from "./interfases";
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

  constructor(private containerName: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING as string
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
  getURL(name: string): string {
    return this.containerClient.getBlockBlobClient(name).url;
  }
  async getPublicURL(name: string): Promise<string> {
    return await this.containerClient.getBlockBlobClient(name).generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(Date.now() - 300 * 1000),
      expiresOn: new Date(Date.now() + 3600 * 24 * 7 * 30 * 1000),
    });
  }
  async getBuffer(name: string): Promise<Buffer> {
    return await this.containerClient
      .getBlockBlobClient(name)
      .downloadToBuffer(0);
  }
  async isBlobExist(name: string): Promise<boolean> {
    return await this.containerClient.getBlockBlobClient(name).exists();
  }
}
