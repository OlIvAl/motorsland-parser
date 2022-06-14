import Puppeteer, { Browser } from "puppeteer";
import { IItemData, ISource } from "../interfases";
import { PageWithListBuilder } from "./PageWithListBuilder";
import { IDocumentBuilder } from "./interfaces";
import { PageWithInfo } from "./PageWithInfo";

export class DocumentBuilder implements IDocumentBuilder {
  private browser?: Browser;
  private sources?: ISource[];
  private vendorCodesListFromLastDocument?: string[];
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
      });
    }
    /*this.browser = await Puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args:
        process.env.NODE_ENV === "production"
          ? ["--use-gl=egl", "--no-sandbox", "--disable-setuid-sandbox"]
          : undefined,
    });*/
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

    const listPageBuilder = new PageWithListBuilder(this.browser);

    listPageBuilder.setUrl(source.site + source.linkListUrl);

    listPageBuilder.setLastPageXpath(source.lastPageXpath);
    listPageBuilder.setLinkXpath(source.linkXpath);
    listPageBuilder.setListPageExpression(source.listPageExpression);

    await listPageBuilder.init();

    const result = await listPageBuilder.getNewLinksList(
      this.vendorCodesListFromLastDocument
    );

    await listPageBuilder.dispose();

    return result;
  }

  private async getDataBySource(
    source: ISource,
    newLinksList: string[]
  ): Promise<IItemData[]> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }

    let result: IItemData[] = [];

    const pageWithInfo = new PageWithInfo(this.browser);

    for (let i = 0; i < newLinksList.length; i++) {
      await pageWithInfo.init(newLinksList[i]);

      const data = await pageWithInfo.getPageData(source.fields);
      const images = await pageWithInfo.getImageLinks(source.imagesXPath);

      if (data.vendor_code) {
        // Set preVendorCode
        data.vendor_code = source.preVendorCode + data.vendor_code;
        result.push({ ...data, images });

        console.log(
          `(${i + 1} из ${newLinksList.length})Страница ${
            newLinksList[i]
          } обработана!`
        );
      } else {
        console.error(
          `Страница ${newLinksList[i]} не обработана! Отсутствует информация`
        );
      }
    }

    await pageWithInfo.dispose();

    return result;
  }

  async getNewLinksCount(): Promise<number> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: string[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const sourceResult = await this.getNewLinksListBySource(this.sources[i]);
      result = [...result, ...sourceResult];
    }

    return result.length;
  }

  async buildDocument(): Promise<void> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: IItemData[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const newLinksList = await this.getNewLinksListBySource(this.sources[i]);
      const sourceResult = await this.getDataBySource(
        this.sources[i],
        newLinksList
      );

      result = [...result, ...sourceResult];
    }

    this.document = result;
  }

  getDocument(): IItemData[] {
    return this.document;
  }

  async dispose(): Promise<void> {
    this.sources = undefined;
    this.vendorCodesListFromLastDocument = undefined;

    if (this.browser) {
      await this.browser.close();
    }
  }
}
