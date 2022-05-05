import puppeteer, { Browser, Page } from "puppeteer";
import { IDocumentData, IEngineItemData } from "../interfases";
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

  private async setData(): Promise<void> {
    function getNameFromPage(): Pick<IEngineItemData, "name"> {
      const tag = document.querySelector(".cont .navigation .mb-20");
      if (!tag) {
        console.log(`Страница не содержит наименования`);

        return { name: "" };
      }

      return { name: tag.textContent || "" };
    }
    const getDataFromPage = async (page: Page): Promise<IEngineItemData> => {
      async function getData(text: string): Promise<string | undefined> {
        const elements = await page.$x(
          `//th[contains(., '${text}')]/following-sibling::td`
        );

        if (!elements.length) {
          return undefined;
        }

        return await page.evaluate((td) => td.textContent || "", elements[0]);
      }

      const [
        vendorCode,
        mark,
        model,
        auto,
        year,
        engineType,
        engineMark,
        engineNumber,
        weight,
        description,
        kpp,
        vin,
      ] = await Promise.all(
        [
          "Артикул",
          "Марка",
          "Модель",
          "Автомобиль",
          "Год",
          "Тип двигателя",
          "Маркировка двигателя",
          "Номер двигателя",
          "Габариты, вес",
          "Описание",
          "КПП",
          "VIN",
        ].map(async (text) => await getData(text))
      );

      const info = {
        name: "",
        vendor_code: vendorCode || "",
        mark,
        model,
        auto,
        year,
        engine_type: engineType,
        engine_mark: engineMark,
        engine_number: engineNumber,
        weight,
        description,
        kpp,
        vin,
        images: { image: [] },
      };

      return (
        Object.keys(info) as (keyof IEngineItemData)[]
      ).reduce<IEngineItemData>(
        (result, key) => {
          if (info[key]) {
            return {
              ...result,
              [key]: info[key],
            };
          }

          return result;
        },
        { name: info.name, vendor_code: info.vendor_code, images: info.images }
      );
    };
    function getImgLinksFromPage(): Pick<IEngineItemData, "images"> {
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

      const data = await getDataFromPage(itemPage);
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

  async buildDocument(): Promise<IDocumentData> {
    this.setVendorCodesListFromLastDocument();
    await this.setNewLinksList();
    await this.setData();

    return this.document;
  }

  async dispose(): Promise<void> {
    if (!this.browser) {
      throw Error("Браузер не проинициализирован!");
    }

    await this.browser.close();
  }
}
