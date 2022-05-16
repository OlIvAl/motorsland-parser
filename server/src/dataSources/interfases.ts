import { BlobClient, BlobUploadCommonResponse } from "@azure/storage-blob";

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

export interface IAzureTableStorage {
  init(): Promise<void>;
  insert(): Promise<void>;
  update(): Promise<void>;
}

export interface IProductFacade {
  getNewItemsCount(): Promise<number>;
  getDocumentsInfo(): Promise<IDocumentInfo[]>;
  uploadNewDocument(fields: Record<string, string>): Promise<void>;
  deleteDocument(name: string): Promise<void>;
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
