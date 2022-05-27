import { IFieldSelector, IItemData } from "../interfases";
import { Browser, Page } from "puppeteer";
import { PuppeteerHelpers } from "./PuppeteerHelpers";

export class PageWithInfo {
  private page?: Page;

  constructor(private browser: Browser) {
    this.selectItemData = this.selectItemData.bind(this);
    this.init = this.init.bind(this);
    this.getItemData = this.getItemData.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  private async getFieldBySelector(
    page: Page,
    fieldSelector: IFieldSelector
  ): Promise<Record<string, string | undefined>> {
    const { field, xpath, cleanRegexp } = fieldSelector;

    const elementHandlers = await page.$x(xpath);

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

  private async getImageLinks(page: Page, xpath: string): Promise<string[]> {
    const imageHandlers = await page.$x(xpath);

    return await Promise.all(
      imageHandlers.map((handler) =>
        page.evaluate((img) => img.src || "", handler)
      )
    );
  }

  private async selectItemData(
    page: Page,
    fieldSelectors: IFieldSelector[],
    imagesXPath: string
  ): Promise<IItemData> {
    const result = (
      await Promise.all(
        fieldSelectors.map((fieldSelector) =>
          this.getFieldBySelector(page, fieldSelector)
        )
      )
    ).reduce<Record<string, string | undefined>>(
      (acc, item) => ({
        ...acc,
        ...item,
      }),
      {}
    ) as IItemData;

    const images = await this.getImageLinks(page, imagesXPath);

    return { ...result, images };
  }

  async init(): Promise<void> {
    this.page = await PuppeteerHelpers.getNewPage(this.browser);
  }

  async getItemData(
    link: string,
    fieldSelectors: IFieldSelector[],
    imagesXPath: string
  ): Promise<IItemData> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    await this.page.goto(link, { waitUntil: "networkidle2", timeout: 0 });

    return await this.selectItemData(this.page, fieldSelectors, imagesXPath);
  }

  async dispose(): Promise<void> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    await this.page.close();
  }
}
