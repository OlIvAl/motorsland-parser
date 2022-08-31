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
  getFields(): Promise<ITableField[]>;
  getFieldSelectorsBySource(source: string): Promise<IFieldSelector[]>;
  setFields(fields: Record<string, string>): Promise<void>;
  getLinks(source: string): Promise<string[]>;
  getWatermarkSettings(source: string): Promise<IWatermarkSettings | undefined>;
  getListSource(source: string): Promise<IListSource>;
}

export interface IDocumentTableClient {
  getSources(): Promise<
    Record<
      string,
      Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
    >
  >;
  getDataRows(name: string): AsyncIterable<IDataRow>;
  getImgSrcArr(vendorCode: string): Promise<string[]>;
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

export interface ITableCatalogLink {
  linkListUrl: string;
}

export interface IDataRow {
  source: string;

  vendor_code: string;
  price: string;
  name: string;
  condition?: string;
  mark?: string;
  model?: string;
  body?: string;
  number?: string;
  kpp?: string;
  engine_mark?: string;
  engine_volume?: string;
  fuel_type?: string;
  year?: string;
  left_right?: string;
  front_rear?: string;
  up_down?: string;
  description?: string;
  status?: string;
  authenticity?: string;
  vin?: string;
  constr_number?: string;
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
  xpaths: string[];
  cleanRegexps?: string[];
  regexps?: string[];
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
    "field" | "xpaths" | "regexps" | "cleanRegexps" | "value"
  > {}

export interface ITableSource {
  name: string;
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
export interface ISource extends ITableSource {
  name: string;
  linkListUrls: string[];

  watermarkSettings?: IWatermarkSettings;
}
export interface IListSource
  extends Pick<
    ITableSource,
    | "lastPageXpath"
    | "nextPageXpath"
    | "linkXpath"
    | "listPageExpression"
    | "site"
  > {
  name: string;
}
export interface IPageSource
  extends Pick<ITableSource, "imagesXPath" | "name"> {
  fields: IFieldSelector[];
}
