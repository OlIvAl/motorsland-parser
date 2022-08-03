import { Page } from "puppeteer";
import { IBrowserFacade, ILinkListScraper } from "./interfaces";
import { ISourceOfCategory } from "../interfases";
import { BrowserFacade } from "./BrowserFacade";

export class LinkListScraper implements ILinkListScraper {
  private site?: string;
  private linkListUrl?: string;
  private lastPageXpath?: string;
  private nextPageXpath?: string;
  private linkXpath?: string;
  private listPageExpression?: string;
  private preVendorCode?: string;

  constructor(private browser: IBrowserFacade) {
    this.setSource = this.setSource.bind(this);
    this.getNewLinks = this.getNewLinks.bind(this);
    this.getLinks = this.getLinks.bind(this);
    this.scrapLinks = this.scrapLinks.bind(this);
  }

  setSource(source: ISourceOfCategory): void {
    this.linkXpath = source.linkXpath;
    this.lastPageXpath = source.lastPageXpath;
    this.nextPageXpath = source.nextPageXpath;
    this.listPageExpression = source.listPageExpression;
    this.site = source.site;
    this.linkListUrl = source.linkListUrl;
    this.preVendorCode = source.preVendorCode;
  }

  async *getNewLinks(): AsyncIterable<string> {
    if (!this.linkListUrl) {
      throw new Error("linkListUrl не проинициализировано!");
    }

    if (this.lastPageXpath) {
      for await (let link of await this.getLinks(
        this.linkListUrl,
        this.lastPageXpath
      )) {
        yield link;
      }
    } else if (this.nextPageXpath) {
      for await (let link of await this.getLinks(
        this.linkListUrl,
        this.nextPageXpath
      )) {
        yield link;
      }
    } else {
      throw new Error("I do not know, how I can do it!!!");
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

    /*await Promise.map(
      this.urls,
      async (url: string) => {
        if (this.lastPageXpath) {
          return await this.getLinks(url, this.lastPageXpath);
        } else if (this.nextPageXpath) {
          return await this.getLinks(url, this.nextPageXpath);
        } else {
          throw new Error("I do not know, how I can do it!!!");
        }
      },
      { concurrency: 10 }
    );*/

    /*const urlsIterableIterator: IterableIterator<string> = this.linkListUrl.values();

    const workers = Array(10).fill(urlsIterableIterator).map(this.doWork);

    return await Promise.allSettled(workers);*/
  }

  /*private async *doWork(
    iterableIterator: IterableIterator<string>
  ): AsyncIterable<string> {
    for (let url of iterableIterator) {
      if (this.lastPageXpath) {
        for await (let link of await this.getLinks(url, this.lastPageXpath)) {
          yield link;
        }
      } else if (this.nextPageXpath) {
        for await (let link of await this.getLinks(url, this.nextPageXpath)) {
          yield link;
        }
      } else {
        throw new Error("I do not know, how I can do it!!!");
      }
    }
  }*/

  private async *getLinks(url: string, xpath: string): AsyncIterable<string> {
    if (!this.listPageExpression) {
      throw new Error("listPageExpression не проинициализировано!");
    }

    let pageNumber = 0;

    const page = await this.browser.openNewPage();

    do {
      pageNumber = pageNumber + 1;
      const urlWithPage = LinkListScraper.getUrl(
        url,
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

      const scrapLinksGenerator = await this.scrapLinks(page);

      for await (let link of scrapLinksGenerator) {
        yield link;
      }

      console.log(`Завершился сбор ссылок с ${resultUrl}!`);

      if (!(await LinkListScraper.isNextPageExist(page, xpath))) {
        break;
      }
    } while (true);

    await BrowserFacade.closePage(page);
  }

  private static async isNextPageExist(
    page: Page,
    xpath: string
  ): Promise<boolean> {
    const nextPageTagHandles = await page.$x(xpath);

    return !!nextPageTagHandles.length;
  }

  private async *scrapLinks(page: Page): AsyncIterable<string> {
    if (!this.linkXpath) {
      throw new Error("linkXpath не проинициализировано!");
    }

    const linksFromListHandles = await page.$x(this.linkXpath);

    if (!linksFromListHandles.length) {
      console.log("url => ", page.url());
      throw new Error("Ссылки на товары не найдены!");
    }

    for (let linksFromListHandle of linksFromListHandles) {
      // @ts-ignore
      yield await page.evaluate((a) => a.href || "", linksFromListHandle);
    }
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
}
