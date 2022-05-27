import puppeteer, { Browser } from "puppeteer";
import { IItemData, ISource } from "../interfases";
import { PageWithListBuilder } from "./PageWithListBuilder";
import { IDocumentBuilder } from "./interfaces";
import { PageWithInfo } from "./PageWithInfo";

export class DocumentBuilder implements IDocumentBuilder {
  private browser?: Browser;
  private sources?: ISource[];
  private vendorCodesListFromLastDocument?: string[];
  private newLinksList?: string[];
  private lastDocument: IItemData[] = [];
  private document: IItemData[] = [];

  async initBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
  }

  setSources(sources: ISource[]): void {
    this.sources = sources;
  }

  async setLastDocument(document: IItemData[]): Promise<void> {
    this.lastDocument = document;
    this.vendorCodesListFromLastDocument = this.lastDocument.map(
      (item) => item.vendor_code
    );
  }

  private async setNewLinksList(source: ISource): Promise<string[]> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }
    if (!this.vendorCodesListFromLastDocument) {
      throw Error("VendorCodesListFromLastDocument не проинициализирован!");
    }

    const listPageBuilder = new PageWithListBuilder(this.browser);

    listPageBuilder.setUrl(source.site + source.categoryListUrl);

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

  private async setData(source: ISource): Promise<IItemData[]> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }
    if (!this.newLinksList) {
      throw Error("NewLinksList не проинициализирован!");
    }

    let result: IItemData[] = [];

    const pageWithInfo = new PageWithInfo(this.browser);
    await pageWithInfo.init();

    for (let i = 0; i < this.newLinksList.length; i++) {
      const data = await pageWithInfo.getItemData(
        this.newLinksList[i],
        source.fieldSelectors,
        source.imagesXPath
      );

      // set prevendorcode
      data.vendor_code = source.preVendorCode + data.vendor_code;

      result = [...result, data];
    }

    await pageWithInfo.dispose();

    return result;
  }

  private setPreVendorCode(preVendorCode: string): void {
    for (let i = 0; i < this.document.length; i++) {
      this.document[i].vendor_code =
        preVendorCode + this.document[i].vendor_code;
    }
  }

  async countNewLinksList(): Promise<void> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: string[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      const sourceResult = await this.setNewLinksList(this.sources[i]);
      result = [...result, ...sourceResult];
    }

    this.newLinksList = result;
  }

  getNewLinksList(): string[] {
    if (!this.newLinksList) {
      throw Error("NewLinksList не проинициализирован!");
    }

    return this.newLinksList;
  }

  async buildDocument(): Promise<void> {
    if (!this.sources) {
      throw Error("Sources не проинициализирован!");
    }

    let result: IItemData[] = [];
    for (let i = 0; i < this.sources.length; i++) {
      await this.setNewLinksList(this.sources[i]);
      const sourceResult = await this.setData(this.sources[i]);

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
    this.newLinksList = undefined;

    if (this.browser) {
      await this.browser.close();
    }
  }
}
