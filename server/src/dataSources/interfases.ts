import { BlobClient, BlobUploadCommonResponse } from "@azure/storage-blob";
import { UPLOADING_NAME } from "../constants";

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
  getURL(name: string): string;
  getPublicURL(name: string): Promise<string>;
  getBuffer(name: string): Promise<Buffer>;
}

export interface IUploadingTableClient {
  getProgress(uploading: UPLOADING_NAME): Promise<boolean>;
  setProgress(uploading: UPLOADING_NAME): Promise<void>;
  unsetProgress(uploading: UPLOADING_NAME): Promise<void>;
  isAnyInProgress(): Promise<boolean>;
  getNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number>;
  setNewDocumentsCount(uploading: UPLOADING_NAME, count: number): Promise<void>;
  getFields(uploading: UPLOADING_NAME): Promise<Record<string, string>>;
  setFields(
    uploading: UPLOADING_NAME,
    fields: Record<string, string>
  ): Promise<void>;
  getSources(uploading: UPLOADING_NAME): Promise<ISource[]>;
}

export interface IDocumentTableClient {
  getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]>;
  getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo>;
  add(uploading: UPLOADING_NAME, json: object): Promise<IDocumentInfo>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
}

export interface IImageBuilder {
  getBuffer(): Promise<[string, Buffer]>;
}

export interface IUploadingItem {
  fields: string;
  newDocumentsCount: number;
  progress: boolean;
  sources: string;
}

export interface IDocumentInfo {
  name: string;
  createdOn?: Date;
}
export interface IItemData {
  name: string;
  price: string;
  vendor_code: string;
  images: string[];
  [field: string]: any;
}

export interface IUploadingSource {
  site: string;
}

export interface ITableSource {
  uploadingId: string;
  categoryListUrl: string;
  fieldXPaths: {
    field: string;
    xpath: string;
  }[];
}
export interface ISource extends ITableSource {
  site: string;
}
