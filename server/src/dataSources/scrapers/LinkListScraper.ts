import { Page } from "puppeteer";
import { IBrowserFacade, ILinkListScraper } from "./interfaces";
import { ISource } from "../interfases";
import { BrowserFacade } from "./BrowserFacade";

export class LinkListScraper implements ILinkListScraper {
  private page?: Page;
  // private vendorCodesListFromLastDocument?: string[];
  private site?: string;
  private url?: string;
  private lastPageXpath?: string;
  private nextPageXpath?: string;
  private linkXpath?: string;
  private listPageExpression?: string;
  private preVendorCode?: string;

  constructor(private browser: IBrowserFacade) {
    this.setSource = this.setSource.bind(this);
    this.setVendorCodesListFromLastDocument =
      this.setVendorCodesListFromLastDocument.bind(this);
    this.init = this.init.bind(this);
    this.getNewLinks = this.getNewLinks.bind(this);
    this.getNewLinksWithLastPage = this.getNewLinksWithLastPage.bind(this);
    this.getNewLinksWithNextPage = this.getNewLinksWithNextPage.bind(this);
    this.scrapLastPageNumber = this.scrapLastPageNumber.bind(this);
    this.scrapNextPageLink = this.scrapNextPageLink.bind(this);
    this.scrapLinks = this.scrapLinks.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  setSource(source: ISource): void {
    this.linkXpath = source.linkXpath;
    this.lastPageXpath = source.lastPageXpath;
    this.nextPageXpath = source.nextPageXpath;
    this.listPageExpression = source.listPageExpression;
    this.site = source.site;
    this.url = source.site + source.linkListUrl;
    this.preVendorCode = source.preVendorCode;
  }
  setVendorCodesListFromLastDocument(codes: string[]): void {
    // this.vendorCodesListFromLastDocument = codes;
  }

  private async init(): Promise<void> {
    this.page = await this.browser.openNewPage();
  }

  async getNewLinks(): Promise<string[]> {
    await this.init();

    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }

    // ToDo: KOSTYLLLLLL!!!!!!
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

    await this.page.goto(this.url, { waitUntil: "networkidle2" });

    if (this.lastPageXpath) {
      return await this.getNewLinksWithLastPage();
    } else if (this.nextPageXpath) {
      return await this.getNewLinksWithNextPage();
    }

    throw new Error("I do not know, how I can do it!!!");
  }

  private async getNewLinksWithLastPage(): Promise<string[]> {
    /*if (!this.vendorCodesListFromLastDocument) {
      throw Error("VendorCodesListFromLastDocument не проинициализирован!");
    }*/
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }
    if (!this.listPageExpression) {
      throw new Error("listPageExpression не проинициализировано!");
    }

    let flag = false;
    let result: string[] = [];

    const getUrl = (
      baseUrl: string,
      listPageExpression: string,
      page: number
    ): string => {
      const listPageSubStr = listPageExpression.replace(
        "${number}",
        page.toString()
      );

      return baseUrl + listPageSubStr;
    };
    const lastPage = await this.scrapLastPageNumber();

    for (let i = 1; i < lastPage; i++) {
      if (flag) {
        break;
      }

      await this.init();
      const links = await this.scrapLinks(
        getUrl(this.url, this.listPageExpression, i)
      );
      await this.dispose();

      for (let j = 0; j < links.length; j++) {
        const link = links[j];
        // const vendorCode = (link.match(/(\d+)\/$/) as string[])[1];

        if (
          // ToDo: RETURN!!!!
          /*(vendorCodesListFromLastDocument.length &&
            !vendorCodesListFromLastDocument.includes(
              vendorCode
            )) ||*/
          result.length >= 100000
        ) {
          flag = true;
          break;
        } else {
          result = [...result, link];
        }
      }
      console.log(`Завершился сбор ссылок с ${i} страницы!`);
    }

    return result;
  }
  private async getNewLinksWithNextPage(): Promise<string[]> {
    /*if (!this.vendorCodesListFromLastDocument) {
      throw Error("VendorCodesListFromLastDocument не проинициализирован!");
    }*/
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }

    let result: string[] = [];
    let flag = false;
    let pageNumber = 0;
    let url: string | undefined = this.url;

    do {
      pageNumber = pageNumber + 1;
      if (flag) {
        break;
      }

      // Почему 2 раза??? Разобраться!!!!
      // объединить!!!
      await this.init();

      const links = await this.scrapLinks(url as string);

      for (let j = 0; j < links.length; j++) {
        const link = links[j];
        // const vendorCode = (link.match(/(\d+)\/$/) as string[])[1];

        if (
          // ToDo: RETURN!!!!
          /*(this.vendorCodesListFromLastDocument.length &&
            !this.vendorCodesListFromLastDocument.includes(
              vendorCode
            )) ||*/
          result.length >= 100000
        ) {
          flag = true;
          break;
        } else {
          result = [...result, link];
        }
      }
      console.log(`Завершился сбор ссылок с ${pageNumber} страницы!`);

      url = await this.scrapNextPageLink();

      await this.dispose();

      if (!url) {
        break;
      }
    } while (true);

    return result;
  }

  private async scrapLastPageNumber(): Promise<number> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }
    if (!this.lastPageXpath) {
      throw Error("lastPageXpath не проинициализировано!");
    }

    const lastPageTagHandles = await this.page.$x(this.lastPageXpath);

    if (!lastPageTagHandles.length) {
      throw new Error("Не найдена панель пагинации");
    }

    const lastPage = await this.page.evaluate(
      // @ts-ignore
      (a) => a.getAttribute("href").match(/\d+$/g)[0] || "",
      lastPageTagHandles[0]
    );

    if (!lastPage) {
      throw new Error("Не найден элемент последней страницы!");
    }

    await this.dispose();

    console.log(`Номер последней страницы - ${lastPage}`);

    return parseInt(lastPage as string);
  }

  private async scrapNextPageLink(): Promise<string | undefined> {
    let nextPageLink = "";
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }
    if (!this.nextPageXpath) {
      throw Error("nextPageXpath не проинициализировано!");
    }

    const nextPageTagHandles = await this.page.$x(this.nextPageXpath);

    if (nextPageTagHandles.length) {
      nextPageLink = await this.page.evaluate(
        (a) => a.getAttribute("href") || "",
        nextPageTagHandles[0]
      );
    }

    return nextPageLink;
  }

  private async scrapLinks(url: string): Promise<string[]> {
    if (!this.page) {
      throw new Error("Страница не проинициализирован!");
    }
    if (!this.linkXpath) {
      throw new Error("linkXpath не проинициализировано!");
    }

    const resultUrl = new RegExp(`^${this.site}`).test(url)
      ? url
      : this.site + url;

    await this.page.goto(resultUrl, {
      waitUntil: "networkidle2",
    });

    const linksFromListHandles = await this.page.$x(this.linkXpath);

    if (!linksFromListHandles.length) {
      console.log("url => ", this.page.url());
      throw Error("Ссылки на товары не найдены!");
    }

    return await Promise.all(
      linksFromListHandles.map((handler) =>
        // @ts-ignore
        this.page.evaluate((a) => a.href || "", handler)
      )
    );
  }

  private async dispose(): Promise<void> {
    if (!this.page) {
      throw new Error("Страница не проинициализирован!");
    }

    await BrowserFacade.closePage(this.page);
  }
}
