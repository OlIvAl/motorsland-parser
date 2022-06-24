import Puppeteer, { Browser } from "puppeteer";
import { IItemData, ISource } from "../interfases";
import { PageWithListBuilder } from "./PageWithListBuilder";
import { IDocumentBuilder } from "./interfaces";
import { PageWithInfo } from "./PageWithInfo";
import { Conveyor } from "./Conveyor";

export class DocumentBuilder implements IDocumentBuilder {
  private browser?: Browser;
  private sources?: ISource[];
  private vendorCodesListFromLastDocument?: string[];
  private newLinks: string[] = [];
  private document: IItemData[] = [];

  async initBrowser(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      this.browser = await Puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`,
        defaultViewport: null,
      });
    } else {
      this.browser = await Puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--js-flags=--expose-gc",
          "--single-process",
          "--no-zygote",
        ],
      });
    }
  }

  setSources(sources: ISource[]): void {
    this.sources = sources;
  }

  setVendorCodesListFromLastDocument(codes: string[]): void {
    this.vendorCodesListFromLastDocument = codes;
  }

  private async getNewLinksListBySource(source: ISource): Promise<string[]> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }
    if (!this.vendorCodesListFromLastDocument) {
      throw Error("VendorCodesListFromLastDocument не проинициализирован!");
    }

    console.log("Начат процесс сбора новых ссылок");

    const listPageBuilder = new PageWithListBuilder(this.browser);

    listPageBuilder.setUrl(source.site + source.linkListUrl);

    listPageBuilder.setLastPageXpath(source.lastPageXpath);
    listPageBuilder.setLinkXpath(source.linkXpath);
    listPageBuilder.setListPageExpression(source.listPageExpression);

    const result = await listPageBuilder.getNewLinksList(
      this.vendorCodesListFromLastDocument
    );

    console.log(
      `Закончен процесс сбора новых ссылок. Результат: ${result.length} ссылок`
    );

    return result;
  }

  private async getDataBySource(
    source: ISource,
    newLinksList: string[]
  ): Promise<IItemData[]> {
    const chunkSize = 10;

    console.log(
      `Время начала: ${new Date().toLocaleDateString("ru", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}`
    );

    const conveyor = new Conveyor(newLinksList, chunkSize, this.getDataByPage, [
      source,
      this.browser,
    ]);

    return (await conveyor.handle()).filter((obj) =>
      Boolean(obj)
    ) as IItemData[];
  }

  private async getDataByPage(
    url: string,
    source: ISource,
    browser: Browser
  ): Promise<IItemData | undefined> {
    if (!browser) {
      throw Error("Браузер не проинициализирован!");
    }

    const page = new PageWithInfo(browser);
    await page.init(url);

    const [data, images] = await Promise.all([
      page.getPageData(source.fields),
      page.getImageLinks(source.imagesXPath),
    ]);

    await page.dispose();

    if (data.vendor_code) {
      // Set preVendorCode
      data.vendor_code = source.preVendorCode + data.vendor_code;

      // console.log(`Страница ${url} обработана!`);

      return { ...data, images };
    } else {
      console.error(`Страница ${url} не обработана! Отсутствует информация`);
    }
  }

  async scrapNewLinks(): Promise<void> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: string[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const sourceResult = await this.getNewLinksListBySource(this.sources[i]);
      result = [...result, ...sourceResult];
    }

    this.newLinks = result;
  }

  setNewLinks(links: string[]): void {
    this.newLinks = links;
  }

  async scrapData(): Promise<void> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: IItemData[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const sourceResult = await this.getDataBySource(
        this.sources[i],
        this.newLinks
      );

      result = [...result, ...sourceResult];
    }

    this.document = result;
  }

  getScrapedData(): IItemData[] {
    return this.document;
  }

  getNewLinks(): string[] {
    return this.newLinks;
  }

  async dispose(): Promise<void> {
    this.sources = undefined;
    this.vendorCodesListFromLastDocument = undefined;

    if (this.browser) {
      await this.browser.close();
    }
  }
}
