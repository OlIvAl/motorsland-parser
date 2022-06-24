import { IItemData, ISource } from "../interfases";
import { IBrowserFacade, IDocumentBuilder } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";
import { LinkListScraper } from "./LinkListScraper";
import { DataScraper } from "./DataScraper";

export class DocumentBuilder implements IDocumentBuilder {
  private browser: IBrowserFacade = new BrowserFacade();
  private sources?: ISource[];
  private vendorCodesListFromLastDocument?: string[];
  private newLinks: string[][] = [];
  private document: IItemData[] = [];

  async init(): Promise<void> {
    await this.browser.init();
  }

  setSources(sources: ISource[]): void {
    this.sources = sources;
  }
  setNewLinks(links: string[][]): void {
    this.newLinks = links;
  }
  setVendorCodesListFromLastDocument(codes: string[]): void {
    this.vendorCodesListFromLastDocument = codes;
  }

  async scrapNewLinks(): Promise<void> {
    if (!this.sources) {
      throw new Error("Sources не проинициализирован!");
    }
    if (!this.vendorCodesListFromLastDocument) {
      throw new Error("VendorCodesListFromLastDocument не проинициализирован!");
    }

    const linkListScraper = new LinkListScraper(this.browser);

    let result: string[][] = [];
    for (let source of this.sources) {
      linkListScraper.setVendorCodesListFromLastDocument(
        this.vendorCodesListFromLastDocument
      );
      linkListScraper.setSource(source);

      const sourceResult = await linkListScraper.getNewLinks();

      result = [...result, sourceResult];
    }

    this.newLinks = result;
  }

  async scrapData(): Promise<void> {
    if (!this.sources || !this.sources.length) {
      throw Error("Sources не проинициализирован!");
    }

    const dataScraper = new DataScraper(this.browser);

    let result: IItemData[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      dataScraper.setSource(this.sources[i]);

      const sourceResult = await dataScraper.assembleScrapedData(
        this.newLinks[i]
      );

      result = [...result, ...sourceResult];
    }

    this.document = result;
  }

  getScrapedData(): IItemData[] {
    return this.document;
  }

  getNewLinks(): string[][] {
    return this.newLinks;
  }

  getNewLinksLength(): number {
    return this.newLinks.flat().length;
  }

  async dispose(): Promise<void> {
    this.sources = undefined;
    this.vendorCodesListFromLastDocument = undefined;

    if (this.browser) {
      await this.browser.dispose();
    }
  }
}
