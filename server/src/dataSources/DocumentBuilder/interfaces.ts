import { IItemData, ISource } from "../interfases";

export interface IDocumentBuilder {
  initBrowser(): Promise<void>;
  setSources(sources: ISource[]): void;
  setLastDocument(document: IItemData[]): Promise<void>;
  countNewLinksList(): Promise<void>;
  getNewLinksList(): string[];
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
