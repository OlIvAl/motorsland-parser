import { IItemData, ISource } from "../interfases";

export interface IDocumentBuilder {
  initBrowser(): Promise<void>;
  setSources(sources: ISource[]): void;
  setVendorCodesListFromLastDocument(codes: string[]): void;
  getNewLinksCount(): Promise<number>;
  buildDocument(): Promise<void>;
  getDocument(): IItemData[];
  dispose(): Promise<void>;
}

export interface IPageWithListBuilder {
  setUrl(url: string): void;
  setLastPageXpath(lastPageXpath: string): void;
  setLinkXpath(linkXpath: string): void;
  setListPageExpression(listPageExpression: string): void;

  init(): Promise<void>;
  getNewLinksList(vendorCodesListFromLastDocument: string[]): Promise<string[]>;
  dispose(): Promise<void>;
}
