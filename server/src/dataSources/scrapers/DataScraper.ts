import { IFieldSelector, IItemData, ISource } from "../interfases";
import { Page } from "puppeteer";
import { Conveyor } from "./Conveyor";
import { IBrowserFacade } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";

export class DataScraper {
  private source?: ISource;

  constructor(private browser: IBrowserFacade) {
    this.getNewPage = this.getNewPage.bind(this);
    this.scrapImageLinks = this.scrapImageLinks.bind(this);
    this.scrapData = this.scrapData.bind(this);
    this.scrapDataByPage = this.scrapDataByPage.bind(this);
  }

  setSource(source: ISource): void {
    this.source = source;
  }

  private async getNewPage(): Promise<Page> {
    return await this.browser.openNewPage();
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

  private async scrapImageLinks(xpath: string, page: Page): Promise<string[]> {
    const imageHandlers = await page.$x(xpath);

    return await Promise.all(
      imageHandlers.map((handler) =>
        page!.evaluate((img) => (img as HTMLImageElement).src || "", handler)
      )
    );
  }

  private async scrapData(
    fieldSelectors: IFieldSelector[],
    page: Page
  ): Promise<IItemData> {
    const parsedData = await Promise.all(
      fieldSelectors.map((fieldSelector) =>
        DataScraper.getFieldBySelector(page, fieldSelector)
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

  private async scrapDataByPage(url: string): Promise<IItemData | undefined> {
    if (!this.source) {
      throw new Error("Source не проинициализирован!");
    }

    const page = await this.getNewPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    const [data, images] = await Promise.all([
      this.scrapData(this.source.fields, page),
      this.scrapImageLinks(this.source.imagesXPath, page),
    ]);

    await BrowserFacade.closePage(page);

    if (data.vendor_code) {
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

    const conveyor = new Conveyor<string, IItemData | undefined>(
      newLinksList,
      chunkSize,
      this.scrapDataByPage,
      [this.source]
    );

    return (await conveyor.handle()).filter((obj) =>
      Boolean(obj)
    ) as IItemData[];
  }
}
