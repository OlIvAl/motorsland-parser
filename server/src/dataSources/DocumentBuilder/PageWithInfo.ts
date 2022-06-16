import { IFieldSelector, IItemData } from "../interfases";
import { Browser, Page } from "puppeteer";
import { PuppeteerHelpers } from "./PuppeteerHelpers";

export class PageWithInfo {
  private page?: Page;

  constructor(private browser: Browser) {
    this.init = this.init.bind(this);
    this.dispose = this.dispose.bind(this);
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

  async getImageLinks(xpath: string): Promise<string[]> {
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

  async init(link: string): Promise<void> {
    this.page = await PuppeteerHelpers.getNewPage(this.browser);
    await this.page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
  }

  async getPageData(fieldSelectors: IFieldSelector[]): Promise<IItemData> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    const parsedData = await Promise.all(
      fieldSelectors.map((fieldSelector) =>
        PageWithInfo.getFieldBySelector(this.page as Page, fieldSelector)
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

  async dispose(): Promise<void> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    await this.page.close();
  }
}
