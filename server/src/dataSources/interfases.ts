import { BlobClient, BlobUploadCommonResponse } from "@azure/storage-blob";
import { UPLOADING_NAME } from "../constants";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

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
  isBlobExist(name: string): Promise<boolean>;
}

export interface IUploadingTableClient {
  getList(): Promise<IUploading[]>;
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
  getUploadingSources(uploading: UPLOADING_NAME): Promise<ISource[]>;
}

export interface IDocumentTableClient {
  get(name: string): Promise<IUsefulFieldData[][]>;
  getPagePublicImages(vcId: string): Promise<string[]>;
  getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]>;
  getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo | null>;
  addDocument(
    uploading: UPLOADING_NAME,
    document: IItemData[],
    dictionary: IItemSourceDictionary[]
  ): Promise<IDocumentInfo>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  migrate(): Promise<void>;
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
export interface IItemSourceDictionary {
  vendorCode: string;
  sourceName: string;
}
export interface IFieldData {
  name: string;
  value?: string;
}
export interface ITableDocumentField extends IFieldData {
  document: string;
}
export interface IUsefulFieldData
  extends IFieldData,
    Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate"> {}

export interface ITableUploadingSource {
  linkListUrl: string;
}

export interface ITableDocumentSourceRelation {
  document: string;
}
export interface ITableUploadingFieldRelation {
  field: string;
}
export interface ITableField {
  field: string;
  title: string;
}
export interface ITableUploadingFieldSource {
  source: string;
  field: string;
  xpath: string;
  cleanRegexp?: string;
  regexp?: string;
  value?: string;
}
export interface ITableWatermarkSettings {
  source: string;
  watermark: boolean;
  watermarkScale: number;
  position: string;
}

export interface IWatermarkSettings
  extends Pick<ITableWatermarkSettings, "watermarkScale" | "position"> {}

export interface IFieldSelector
  extends Pick<
    ITableUploadingFieldSource,
    "field" | "xpath" | "regexp" | "cleanRegexp" | "value"
  > {}

export interface ITableSource {
  lastPageXpath?: string;
  nextPageXpath?: string;
  linkXpath: string;
  listPageExpression: string;
  preVendorCode: string;
  site: string;
  markup: number;
  exchangeRate: number;
  imagesXPath: string;
  disabled: boolean;
}
export interface ITableImage {
  url: string;
  name: string;
  document: string;
}
export interface ISource extends ITableSource, ITableUploadingSource {
  name: string;
  fields: IFieldSelector[];
  watermarkSettings?: IWatermarkSettings;
}
