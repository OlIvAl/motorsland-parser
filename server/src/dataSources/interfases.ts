import { BlobClient, BlobUploadCommonResponse } from "@azure/storage-blob";
import { CONTAINER_NAME } from "../constants";

// свой инстанс для каждого контейнера
export interface IAzureBlobStorage {
  init(): Promise<void>;
  upload(
    buffer: Buffer,
    name: string,
    mimeType: string
  ): Promise<BlobUploadCommonResponse>;
  deleteBlob(name: string): Promise<void>;
  deleteBlobs(blobClients: BlobClient[]): Promise<void>;
  getPublicURL(name: string): Promise<string>;
  getItemsList(): Promise<IDocumentInfo[]>;
  getBuffer(name: string): Promise<Buffer>;
}

export interface IProgressTableClient {
  getProgress(storage: CONTAINER_NAME): Promise<boolean>;
  setProgress(storage: CONTAINER_NAME): Promise<void>;
  unsetProgress(storage: CONTAINER_NAME): Promise<void>;
}
export interface INewDocumentsCountTableClient {
  getNewDocumentsCount(storage: CONTAINER_NAME): Promise<number>;
  setNewDocumentsCount(storage: CONTAINER_NAME, count: number): Promise<void>;
}

export interface IImageBuilder {
  getBuffer(): Promise<[string, Buffer]>;
}

export interface IDocumentInfo {
  name: string;
  createdOn?: Date;
  publicURL: string;
}
export interface IItemData {
  name: string;
  vendor_code: string;
  images: {
    image: string[];
  };
  [field: string]: any;
}
export interface IDocumentData {
  offers: {
    offer: IItemData[];
  };
}
