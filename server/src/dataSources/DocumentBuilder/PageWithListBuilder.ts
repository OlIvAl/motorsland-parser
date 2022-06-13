import { Browser, Page } from "puppeteer";
import { PuppeteerHelpers } from "./PuppeteerHelpers";
import { IPageWithListBuilder } from "./interfaces";

export class PageWithListBuilder implements IPageWithListBuilder {
  private page?: Page;
  private url?: string;
  private lastPageXpath?: string;
  private linkXpath?: string;
  private listPageExpression?: string;

  constructor(private browser: Browser) {
    this.setUrl = this.setUrl.bind(this);
    this.setLastPageXpath = this.setLastPageXpath.bind(this);
    this.setLinkXpath = this.setLinkXpath.bind(this);
    this.setListPageExpression = this.setListPageExpression.bind(this);
    this.init = this.init.bind(this);
    this.dispose = this.dispose.bind(this);
    this.getNewLinksList = this.getNewLinksList.bind(this);
    this.getLastPageNumber = this.getLastPageNumber.bind(this);
    this.getLinksFromList = this.getLinksFromList.bind(this);
  }

  setUrl(url: string): void {
    this.url = url;
  }
  setLastPageXpath(lastPageXpath: string): void {
    this.lastPageXpath = lastPageXpath;
  }
  setLinkXpath(linkXpath: string): void {
    this.linkXpath = linkXpath;
  }
  setListPageExpression(listPageExpression: string): void {
    this.listPageExpression = listPageExpression;
  }

  async init(): Promise<void> {
    this.page = await PuppeteerHelpers.getNewPage(this.browser);
  }
  async dispose(): Promise<void> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }

    await this.page.close();
  }

  async getNewLinksList(
    vendorCodesListFromLastDocument: string[]
  ): Promise<string[]> {
    let flag = false;

    async function innerGetLinks(
      vendorCodesListFromLastDocument: string[],
      getLinksFromList: (pageNumber: number) => Promise<string[]>,
      lastPage: number,
      result: string[] = []
    ): Promise<string[]> {
      for (let i = 1; i < lastPage; i++) {
        if (flag) {
          break;
        }

        const links = await getLinksFromList(i);

        for (let j = 0; j < links.length; j++) {
          const link = links[j];
          const vendorCode = (link.match(/(\d+)\/$/) as string[])[1];

          if (flag) {
            break;
          } else if (
            (vendorCodesListFromLastDocument.length &&
              vendorCodesListFromLastDocument.includes(
                vendorCode.toString()
              )) ||
            result.length >= 60
          ) {
            flag = true;
            break;
          } else {
            result = [...result, link];
          }
        }
      }

      return result;
    }

    const lastPage = await this.getLastPageNumber();

    return await innerGetLinks(
      vendorCodesListFromLastDocument,
      this.getLinksFromList,
      lastPage
    );
  }

  private async getLastPageNumber(): Promise<number> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.url) {
      throw Error("url не проинициализировано!");
    }
    if (!this.lastPageXpath) {
      throw Error("lastPageXpath не проинициализировано!");
    }

    await this.page.goto(this.url, { waitUntil: "networkidle2" });

    const lastPageTagHandles = await this.page.$x(this.lastPageXpath);

    if (!lastPageTagHandles.length) {
      throw Error("Не найдена панель пагинации");
    }

    const lastPage = await this.page.evaluate(
      (a) => a.textContent || "",
      lastPageTagHandles[0]
    );

    if (!lastPage) {
      throw Error("Не найден элемент последней страницы!");
    }

    return parseInt(lastPage as string);
  }

  private async getLinksFromList(pageNumber: number): Promise<string[]> {
    if (!this.page) {
      throw Error("Страница не проинициализирован!");
    }
    if (!this.linkXpath) {
      throw Error("linkXpath не проинициализировано!");
    }
    if (!this.listPageExpression) {
      throw Error("listPageExpression не проинициализировано!");
    }

    const listPageSubStr = this.listPageExpression.replace(
      "${number}",
      pageNumber.toString()
    );

    await this.page.goto(this.url + listPageSubStr, {
      waitUntil: "networkidle2",
    });

    const linksFromListHandles = await this.page.$x(this.linkXpath);

    if (!linksFromListHandles.length) {
      throw Error("Ссылки на товары не найдены!");
    }

    return await Promise.all(
      linksFromListHandles.map((handler) =>
        // @ts-ignore
        this.page.evaluate((a) => a.href || "", handler)
      )
    );
  }
}
