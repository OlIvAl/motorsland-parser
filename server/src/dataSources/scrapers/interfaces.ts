import { IItemData, IItemSourceDictionary, ISource } from "../interfases";
import { Page } from "puppeteer";

export interface IDocumentBuilder {
  init(): Promise<void>;

  setSources(sources: ISource[]): void;
  setNewLinks(links: string[][]): void;
  setVendorCodesListFromLastDocument(codes: string[]): void;
  getNewLinks(): string[][];
  getNewLinksLength(): number;

  scrapNewLinks(): Promise<void>;
  scrapData(): Promise<void>;
  getItemsBySources(): IItemData[][];
  getDictionary(): IItemSourceDictionary[];
  getNewLinks(): string[][];
  getNewLinksLength(): number;
  dispose(): Promise<void>;
}

export interface ILinkListScraper {
  setSource(source: ISource): void;

  getNewLinks(): Promise<void>;
}

export interface IBrowserFacade {
  init(): Promise<void>;
  openNewPage(): Promise<Page>;
  // closePage(page: Page): Promise<void>;
  dispose(): Promise<void>;
}
