import { Page } from "puppeteer";
import { IBrowserFacade } from "./interfaces";
import { BrowserFacade } from "./BrowserFacade";
import { IListSource } from "../interfases";

export class LinkListScraper {
  private site?: string;
  private lastPageXpath?: string;
  private nextPageXpath?: string;
  private linkXpath?: string;
  private listPageExpression?: string;

  constructor(private browser: IBrowserFacade) {
    this.setSource = this.setSource.bind(this);
    this.getNewLinks = this.getNewLinks.bind(this);
    this.scrapLinks = this.scrapLinks.bind(this);
  }

  async init(): Promise<void> {
    this.browser = new BrowserFacade();
    await this.browser.init();
  }

  setSource(source: IListSource): void {
    this.linkXpath = source.linkXpath;
    this.lastPageXpath = source.lastPageXpath;
    this.nextPageXpath = source.nextPageXpath;
    this.listPageExpression = source.listPageExpression;
    this.site = source.site;
  }

  // ToDo: KOSTYLLLLLL!!!!!!
  /*if (this.site === "https://f-avto.by/") {
      await this.page.setCookie({
        name: "from_country",
        value: "RU",
        domain: "f-avto.by",
        path: "/",
      });
    }*/
  /*if (this.site === "https://www.autopriwos.ru/") {
      await this.page.setCookie(
        {
          name: "ADBSESSION",
          value: "i7otqhk3u84ibfqc6dtuebui1n",
          domain: "www.autopriwos.ru",
          path: "/",
        },
        {
          name: "_gat_UA-196229378-1",
          value: "1",
          domain: ".autopriwos.ru",
          path: "/",
        }
      );
    }*/

  async *getNewLinks(linkListUrl: string): AsyncIterable<string[]> {
    if (!this.lastPageXpath && !this.nextPageXpath) {
      throw new Error("pageXpath не проинициализировано!");
    }
    if (!this.listPageExpression) {
      throw new Error("listPageExpression не проинициализировано!");
    }

    const xpath: string = (this.lastPageXpath || this.nextPageXpath) as string;
    let pageNumber = 0;
    const page = await this.browser.openNewPage();

    do {
      pageNumber = pageNumber + 1;
      const urlWithPage = LinkListScraper.getUrl(
        linkListUrl,
        this.listPageExpression,
        pageNumber
      );
      const resultUrl = new RegExp(`^${this.site}`).test(urlWithPage)
        ? urlWithPage
        : this.site + urlWithPage;

      await page.goto(resultUrl, {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      // @ts-ignore
      console.log("pages =>", (await page.browser().pages()).length);

      yield await this.scrapLinks(page);

      console.log(`Завершился сбор ссылок с ${resultUrl}!`);
    } while (await LinkListScraper.isNextPageExist(page, xpath));
    // } while (pageNumber < 3);

    await BrowserFacade.closePage(page);
  }

  private async scrapLinks(page: Page): Promise<string[]> {
    if (!this.linkXpath) {
      throw new Error("linkXpath не проинициализировано!");
    }

    const linksFromListHandles = await page.$x(this.linkXpath);

    if (!linksFromListHandles.length) {
      console.log("url => ", page.url());
      throw new Error("Ссылки на товары не найдены!");
    }

    return await Promise.all(
      linksFromListHandles.map((handler) =>
        page.evaluate((a: any) => a.href || "", handler)
      )
    );
  }

  private static async isNextPageExist(
    page: Page,
    xpath: string
  ): Promise<boolean> {
    const nextPageTagHandles = await page.$x(xpath);

    return !!nextPageTagHandles.length;
  }

  private static getUrl(
    baseUrl: string,
    listPageExpression: string,
    page: number
  ): string {
    const listPageSubStr = listPageExpression.replace(
      "${number}",
      page.toString()
    );

    return baseUrl + listPageSubStr;
  }

  async dispose(): Promise<void> {
    this.linkXpath = undefined;
    this.lastPageXpath = undefined;
    this.nextPageXpath = undefined;
    this.listPageExpression = undefined;
    this.site = undefined;

    if (this.browser) {
      await this.browser.dispose();
    }
  }
}
