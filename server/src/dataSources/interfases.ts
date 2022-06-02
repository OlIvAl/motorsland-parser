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
  getFields(uploading: UPLOADING_NAME): Promise<ITableField[]>;
  setFields(
    uploading: UPLOADING_NAME,
    fields: Record<string, string>
  ): Promise<void>;
  getSources(uploading: UPLOADING_NAME): Promise<ISource[]>;
}

export interface IDocumentTableClient {
  get(name: string): Promise<ITableDocumentField[][]>;
  getPagePublicImages(vcId: string): Promise<string[]>;
  getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]>;
  getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo | null>;
  addDocument(
    uploading: UPLOADING_NAME,
    document: IItemData[]
  ): Promise<IDocumentInfo>;
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
export interface IFieldData {
  name: string;
  value?: string;
}
export interface ITableDocumentField extends IFieldData {
  document: string;
}

export interface ITableUploadingSource {
  linkListUrl: string;
  imagesXPath: string;
}

export interface ITableUploadingFieldRelation {
  field: string;
}
export interface ITableField {
  field: string;
  title: string;
}
export interface ITableUploadingFieldSource {
  field: string;
  xpath: string;
  cleanRegexp?: string;
  source: string;
}

export interface IFieldSelector {
  field: string;
  xpath: string;
  cleanRegexp?: string;
}

export interface ITableSource {
  lastPageXpath: string;
  linkXpath: string;
  listPageExpression: string;
  preVendorCode: string;
  site: string;
}
export interface ITableImage {
  url: string;
  name: string;
  document: string;
}
export interface ISource extends ITableSource, ITableUploadingSource {
  fields: IFieldSelector[];
}
