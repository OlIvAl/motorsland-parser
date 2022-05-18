import { IDocumentData } from "../interfases";

export interface IDocumentBuilder {
  initBrowser(): Promise<void>;
  setLastDocument(document: string): Promise<void>;
  getNewLinksList(): string[];
  buildDocument(fields: Record<string, string>): Promise<IDocumentData>;
  dispose(): Promise<void>;
}

export interface IPageWithList {
  init(): Promise<void>;
  getNewLinksList(vendorCodesListFromLastDocument: string[]): Promise<string[]>;
  dispose(): Promise<void>;
}
