import { IItemData } from "../interfases";

export interface IDocumentBuilder {
  initBrowser(): Promise<void>;
  setUrl(site: string, root: string): void;
  setLastDocument(document: IItemData[]): Promise<void>;
  getNewLinksList(): string[];
  buildDocument(fields: Record<string, string>): Promise<IItemData[]>;
  dispose(): Promise<void>;
}

export interface IPageWithList {
  init(): Promise<void>;
  getNewLinksList(vendorCodesListFromLastDocument: string[]): Promise<string[]>;
  dispose(): Promise<void>;
}
