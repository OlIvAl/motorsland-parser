import puppeteer, { Browser, Page } from "puppeteer";
import { IDocumentData, IItemData } from "../interfases";
import { PageWithList } from "./PageWithList";
import { IDocumentBuilder } from "./interfaces";
import { PuppeteerHelpers } from "./PuppeteerHelpers";

export class DocumentBuilder implements IDocumentBuilder {
  private lastDocument: string = "";
  private document: IDocumentData = { offers: { offer: [] } };
  private browser?: Browser;
  private vendorCodesListFromLastDocument: string[] = [];
  private newLinksList: string[] = [];

  constructor(private url: string) {}

  async initBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
  }

  async setLastDocument(document: string): Promise<void> {
    this.lastDocument = document;
    this.setVendorCodesListFromLastDocument();
    await this.setNewLinksList();
  }

  private setVendorCodesListFromLastDocument(): void {
    if (this.lastDocument) {
      this.vendorCodesListFromLastDocument = (
        this.lastDocument.match(/<vendor_code>\d+<\/vendor_code>/g) as string[]
      ).map((str) => str.replace(/\D+/g, ""));
    }
  }

  private async setNewLinksList(): Promise<void> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }

    const listPage = new PageWithList(this.url, this.browser);
    await listPage.init();

    this.newLinksList = await listPage.getNewLinksList(
      this.vendorCodesListFromLastDocument
    );

    await listPage.dispose();
  }

  private async setData(fields: Record<string, string>): Promise<void> {
    async function getNameFromPage(page: Page): Promise<string> {
      const elements = await page.$x(
        "//*[contains(@class,'cont')]//*[contains(@class,'navigation')]//*[contains(@class,'mb-20')]"
      );

      if (!elements.length) {
        throw Error("Не найдено наименование!");
      }

      return await page.evaluate((h1) => h1.textContent || "", elements[0]);
    }
    const getDataFromPage = async (
      fields: Record<string, string>,
      page: Page
    ): Promise<IItemData> => {
      async function getData(text: string): Promise<string | undefined> {
        const elements = await page.$x(
          `//th[contains(., '${text}')]/following-sibling::td`
        );

        if (!elements.length) {
          return undefined;
        }

        return await page.evaluate((td) => td.textContent || "", elements[0]);
      }

      const fieldValues = await Promise.all(
        Object.values(fields).map(async (text) => await getData(text))
      );

      return Object.keys(fields).reduce<any>(
        (result, key, i) => {
          if (fieldValues[i]) {
            return {
              ...result,
              [key]: fieldValues[i],
            };
          }

          return result;
        },
        { name: "", vendor_code: "", images: { image: [] } }
      );
    };
    async function getImgLinksFromPage(
      page: Page
    ): Promise<Pick<IItemData, "images">> {
      const imageHandlers = await page.$x(
        "//*[contains(@class,'viki-gallery gallery-big part-carousel')]//img[@loading='lazy']"
      );

      const image = await Promise.all(
        imageHandlers.map((handler) =>
          page.evaluate((img) => img.src || "", handler)
        )
      );

      return { images: { image } };
    }

    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }
    let result: IDocumentData["offers"]["offer"] = [];

    for (let i = 0; i < this.newLinksList.length; i++) {
      const link = this.newLinksList[i];

      const itemPage = await PuppeteerHelpers.getNewPage(this.browser);
      await itemPage.goto(link, { waitUntil: "networkidle2", timeout: 0 });

      const data = await getDataFromPage(fields, itemPage);
      const name = await getNameFromPage(itemPage);
      const images = await getImgLinksFromPage(itemPage);

      result = [...result, { ...data, ...images, name }];
    }

    this.document.offers.offer = result;
  }

  getNewLinksList(): string[] {
    return this.newLinksList;
  }

  async buildDocument(fields: Record<string, string>): Promise<IDocumentData> {
    this.setVendorCodesListFromLastDocument();
    await this.setNewLinksList();
    await this.setData(fields);

    return this.document;
  }

  async dispose(): Promise<void> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }

    await this.browser.close();
  }
}
