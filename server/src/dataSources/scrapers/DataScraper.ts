import { IFieldSelector, IItemData, ISource } from "../interfases";
import { ElementHandle, Page } from "puppeteer";
import { Conveyor } from "./Conveyor";
import { IBrowserFacade } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";
import { getLocalTime } from "../../libs/getLocalTime";

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
    const { field, xpath, cleanRegexp, regexp } = fieldSelector;
    let elementHandlers: ElementHandle<Element>[] = [];

    if (/^\[.*\]$/.test(xpath)) {
      const xpathSelectors = JSON.parse(xpath) as string[];
      for (let xpathSelector of xpathSelectors) {
        const handlers = await page.$x(decodeURIComponent(xpathSelector));

        if (handlers.length) {
          elementHandlers = handlers;
          break;
        } else {
          continue;
        }
      }
    } else {
      elementHandlers = await page.$x(xpath);
    }

    if (!elementHandlers.length) {
      return { [field]: undefined };
    }

    let value = (await page.evaluate((node: Node) => {
      switch (node.nodeType) {
        case 2:
          return node.nodeValue;
        case 3:
          return node.textContent;
        default:
          throw new Error("Unknown node type!!!");
      }
    }, elementHandlers[0])) as string;

    if (cleanRegexp) {
      const match = cleanRegexp.match(
        new RegExp("^/(.*?)/([gimy]*)$")
      ) as RegExpMatchArray;
      value = value.replace(new RegExp(match[1], match[2]), "");
    }
    if (regexp) {
      const match = regexp.match(
        new RegExp("^/(.*?)/([gimy]*)$")
      ) as RegExpMatchArray;

      const result = value.match(new RegExp(match[1], match[2]));

      value = result ? result[result.length - 1] : "";
    }

    return { [field]: value.trim() };
  }

  private async scrapImageLinks(xpath: string, page: Page): Promise<string[]> {
    if (!this.source) {
      throw new Error("Source не проинициализирован!");
    }

    try {
      const imageHandlers = await page.$x(xpath);

      return await Promise.all(
        imageHandlers.map((handler) =>
          page!.evaluate(
            (src, sourceName) => {
              switch (sourceName) {
                case "f-avto.by":
                  // @ts-ignore
                  return ((src as Node).nodeValue as string)
                    .match(/http.+(jpg|jpeg|webp|png|bmp)/)[0]
                    .replace(/(http.+)(d\.)(jpg|jpeg|webp|png|bmp)/, "$1.$3");
                default:
                  return (src as Node).nodeValue || "";
              }
            },
            handler,
            this.source?.name
          )
        )
      );
    } catch (e) {
      console.log(page.url());
      console.log(e);
      throw e;
    }
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

    if (data.vendor_code && !images.length) {
      console.log(`На странице ${page.url()} не обнаружено картинок!!!`);
    }

    if (data.vendor_code && !data.price) {
      console.warn(`На странице ${page.url()} отсутствует цена!`);
    }
    await BrowserFacade.closePage(page);
    if (data.vendor_code) {
      return { ...data, images };
    } else {
      console.error(`Страница ${url} не обработана! Отсутствует информация`);
    }
  }

  async assembleScrapedData(newLinksList: string[]): Promise<IItemData[]> {
    const chunkSize = 10;

    console.log(`Время начала: ${getLocalTime()}`);

    const conveyor = new Conveyor<string, IItemData | undefined>(
      newLinksList,
      chunkSize,
      this.scrapDataByPage,
      [this.source]
    );

    conveyor.setLogNumber(10);
    conveyor.setStartHandleTime(false);

    return (await conveyor.handle()).filter((obj) =>
      Boolean(obj)
    ) as IItemData[];
  }
}
