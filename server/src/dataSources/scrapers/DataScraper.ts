import { IFieldSelector, IItemData, ISource } from "../interfases";
import { Page } from "puppeteer";
import { Conveyor } from "./Conveyor";
import { IBrowserFacade } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";

// ToDo: попробовать сделать фабрику
export class DataScraper {
  private page?: Page;
  private source?: ISource;

  constructor(private browser: IBrowserFacade) {
    this.init = this.init.bind(this);
    this.scrapImageLinks = this.scrapImageLinks.bind(this);
    this.scrapData = this.scrapData.bind(this);
    this.scrapDataByPage = this.scrapDataByPage.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  setSource(source: ISource): void {
    this.source = source;
  }

  private async init(): Promise<void> {
    this.page = await this.browser.openNewPage();
  }

  private static async getFieldBySelector(
    page: Page,
    fieldSelector: IFieldSelector
  ): Promise<Record<string, string | undefined>> {
    const { field, xpath, cleanRegexp } = fieldSelector;

    const elementHandlers = await page.$x(xpath);

    if (!elementHandlers.length && field === "price") {
      console.warn(`На странице ${page.url()} отсутствует цена!`);
    }

    if (!elementHandlers.length) {
      return { [field]: undefined };
    }

    let value = (await page.evaluate(
      (tag) => tag.textContent || "",
      elementHandlers[0]
    )) as string;

    if (cleanRegexp) {
      const match = cleanRegexp.match(
        new RegExp("^/(.*?)/([gimy]*)$")
      ) as string[];
      value = value.replace(new RegExp(match[1], match[2]), "");
    }

    return { [field]: value };
  }

  private async scrapImageLinks(xpath: string): Promise<string[]> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    const imageHandlers = await this.page.$x(xpath);

    return await Promise.all(
      imageHandlers.map((handler) =>
        this.page!.evaluate((img) => img.src || "", handler)
      )
    );
  }

  private async scrapData(
    fieldSelectors: IFieldSelector[]
  ): Promise<IItemData> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    const parsedData = await Promise.all(
      fieldSelectors.map((fieldSelector) =>
        DataScraper.getFieldBySelector(this.page as Page, fieldSelector)
      )
    );

    return parsedData.reduce<Record<string, string | undefined>>(
      (acc, item) => ({
        ...acc,
        ...item,
      }),
      {}
    ) as IItemData;
  }

  private async scrapDataByPage(
    url: string,
    source: ISource
  ): Promise<IItemData | undefined> {
    if (!this.source) {
      throw new Error("Source не проинициализирован!");
    }

    const [data, images] = await Promise.all([
      this.scrapData(this.source.fields),
      this.scrapImageLinks(this.source.imagesXPath),
    ]);

    //await this.dispose();
    // Закрывать страницу

    if (data.vendor_code) {
      // Set preVendorCode
      data.vendor_code = source.preVendorCode + data.vendor_code;

      // console.log(`Страница ${url} обработана!`);

      return { ...data, images };
    } else {
      console.error(`Страница ${url} не обработана! Отсутствует информация`);
    }
  }

  async assembleScrapedData(newLinksList: string[]): Promise<IItemData[]> {
    const chunkSize = 10;

    console.log(
      `Время начала: ${new Date().toLocaleDateString("ru", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}`
    );

    await this.init();

    const conveyor = new Conveyor(
      newLinksList,
      chunkSize,
      this.scrapDataByPage,
      [this.source]
    );

    const result = (await conveyor.handle()).filter((obj) =>
      Boolean(obj)
    ) as IItemData[];

    await this.dispose();

    return result;
  }

  private async dispose(): Promise<void> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    await BrowserFacade.closePage(this.page);
  }
}
