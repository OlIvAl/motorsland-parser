import { BlobClient, BlobUploadCommonResponse } from "@azure/storage-blob";

// свой инстанс для каждого контейнера
export interface IAzureBlobStorageContainer {
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
export interface IProductFacade {
  getNewItemsCount(): Promise<number>;
  getDocumentsInfo(): Promise<IDocumentInfo[]>;
  uploadNewDocument(): Promise<void>;
  downloadDocument(name: string): Promise<Buffer>;
  deleteDocument(name: string): Promise<void>;
  getDocumentPublicURL(name: string): Promise<string>;
}

export interface IImageBuilder {
  getBuffer(): Promise<[string, Buffer]>;
}

export interface IDocumentInfo {
  name: string;
  createdOn?: Date;
  publicURL: string;
}
export interface IEngineItemData {
  name: string;
  vendor_code: string;
  mark?: string;
  model?: string;
  auto?: string;
  year?: string;
  engine_type?: string;
  engine_mark?: string;
  engine_number?: string;
  weight?: string;
  description?: string;
  kpp?: string;
  vin?: string;
  images: {
    image: string[];
  };
}
export interface IDocumentData {
  offers: {
    offer: IEngineItemData[];
  };
}
