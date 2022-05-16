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

  setLastDocument(document: string): void {
    this.lastDocument = document;
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
    function getNameFromPage(): Pick<IItemData, "name"> {
      const tag = document.querySelector(".cont .navigation .mb-20");
      if (!tag) {
        console.log(`Страница не содержит наименования`);

        return { name: "" };
      }

      return { name: tag.textContent || "" };
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
    function getImgLinksFromPage(): Pick<IItemData, "images"> {
      const image = Array.from(
        document.querySelectorAll(
          ".viki-gallery.gallery-big.part-carousel img[loading=lazy]"
        )
      ).map((tag) => tag.getAttribute("src") as string);

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
      const name = await itemPage.evaluate(getNameFromPage);
      const images = await itemPage.evaluate(getImgLinksFromPage);

      result = [...result, { ...data, ...name, ...images }];
    }

    this.document.offers.offer = result;
  }

  async getNewLinksList(): Promise<string[]> {
    this.setVendorCodesListFromLastDocument();
    await this.setNewLinksList();

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
