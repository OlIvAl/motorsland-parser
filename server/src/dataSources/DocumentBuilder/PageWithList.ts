import { Browser, Page } from "puppeteer";
import { PuppeteerHelpers } from "./PuppeteerHelpers";
import { IPageWithList } from "./interfaces";

export class PageWithList implements IPageWithList {
  private page?: Page;

  constructor(private url: string, private browser: Browser) {
    this.init = this.init.bind(this);
    this.dispose = this.dispose.bind(this);
    this.getNewLinksList = this.getNewLinksList.bind(this);
    this.getLastPageNumber = this.getLastPageNumber.bind(this);
    this.getLinksFromList = this.getLinksFromList.bind(this);
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

    await this.page.goto(this.url, { waitUntil: "networkidle2" });

    const lastPageTagHandles = await this.page.$x(
      "//div[@class='pgng']/a[@class='viki-pg-last']"
    );

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

    await this.page.goto(this.url + "?pg=" + pageNumber, {
      waitUntil: "networkidle2",
    });

    const linksFromListHandles = await this.page.$x(
      "//*[@class='main-content']//ul[contains(@class, 'grid-new')]/li/*[@class='item-title']/a"
    );

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
