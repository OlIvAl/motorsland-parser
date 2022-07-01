import { IItemData, IItemSourceDictionary, ISource } from "../interfases";
import { IBrowserFacade, IDocumentBuilder } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";
import { LinkListScraper } from "./LinkListScraper";
import { DataScraper } from "./DataScraper";

export class DocumentBuilder implements IDocumentBuilder {
  private browser?: IBrowserFacade;
  private sources?: ISource[];
  private vendorCodesListFromLastDocument?: string[];
  private newLinks: string[][] = [];
  private items: IItemData[] = [];
  private dictionary: IItemSourceDictionary[] = [];

  constructor() {
    this.init = this.init.bind(this);
    this.setSources = this.setSources.bind(this);
    this.setNewLinks = this.setNewLinks.bind(this);
    this.setVendorCodesListFromLastDocument =
      this.setVendorCodesListFromLastDocument.bind(this);
    this.scrapNewLinks = this.scrapNewLinks.bind(this);
    this.scrapData = this.scrapData.bind(this);
    this.getScrapedData = this.getScrapedData.bind(this);
    this.getNewLinks = this.getNewLinks.bind(this);
    this.getNewLinksLength = this.getNewLinksLength.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  async init(): Promise<void> {
    this.browser = new BrowserFacade();
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
    if (!this.browser) {
      throw new Error("Browser не проинициализирован!");
    }
    if (!this.sources) {
      throw new Error("Sources не проинициализирован!");
    }
    if (!this.vendorCodesListFromLastDocument) {
      throw new Error("VendorCodesListFromLastDocument не проинициализирован!");
    }

    const linkListScraper = new LinkListScraper(this.browser);

    let result: string[][] = [];

    const sources = this.sources.filter((source) => !source.disabled);

    for (let source of sources) {
      console.log(`Начат сбор новых ссылок с ${source.name}`);

      linkListScraper.setVendorCodesListFromLastDocument(
        this.vendorCodesListFromLastDocument
      );
      linkListScraper.setSource(source);

      const sourceResult = await linkListScraper.getNewLinks();

      result = [...result, sourceResult];

      console.log(
        `Закончен сбора новых ссылок с ${source.name}. Результат: ${sourceResult.length} ссылок`
      );
    }
    console.log(
      `Собрано ${result.reduce((sum, arr) => sum + arr.length, 0)} ссылок!`
    );
    this.newLinks = result;
  }

  async scrapData(): Promise<void> {
    if (!this.browser) {
      throw new Error("Browser не проинициализирован!");
    }
    if (!this.sources || !this.sources.length) {
      throw new Error("Sources не проинициализирован!");
    }

    const dataScraper = new DataScraper(this.browser);

    let items: IItemData[] = [];
    let dictionary: IItemSourceDictionary[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      dataScraper.setSource(this.sources[i]);

      const sourceItems = await dataScraper.assembleScrapedData(
        this.newLinks[i]
      );
      const sourceDictionary = sourceItems.map((item) => ({
        vendorCode: item.vendor_code,
        sourceName: (this.sources as ISource[])[i].name,
      }));

      items = [...items, ...sourceItems];
      dictionary = [...dictionary, ...sourceDictionary];
    }

    this.items = items;
    this.dictionary = dictionary;
  }

  getScrapedData(): IItemData[] {
    return this.items;
  }
  getDictionary(): IItemSourceDictionary[] {
    return this.dictionary;
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
