import { Page } from "puppeteer";
import { IBrowserFacade, ILinkListScraper } from "./interfaces";
import { ISource } from "../interfases";
import { BrowserFacade } from "./BrowserFacade";

export class LinkListScraper implements ILinkListScraper {
  private page?: Page;
  private vendorCodesListFromLastDocument?: string[];
  private url?: string;
  private lastPageXpath?: string;
  private linkXpath?: string;
  private listPageExpression?: string;
  private preVendorCode?: string;

  constructor(private browser: IBrowserFacade) {
    this.setSource = this.setSource.bind(this);
    this.setVendorCodesListFromLastDocument =
      this.setVendorCodesListFromLastDocument.bind(this);
    this.getNewLinks = this.getNewLinks.bind(this);
    this.init = this.init.bind(this);
    this.assembleNewLinksList = this.assembleNewLinksList.bind(this);
    this.scrapLastPageNumber = this.scrapLastPageNumber.bind(this);
    this.scrapLinks = this.scrapLinks.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  setSource(source: ISource): void {
    this.linkXpath = source.linkXpath;
    this.lastPageXpath = source.lastPageXpath;
    this.listPageExpression = source.listPageExpression;
    this.url = source.site + source.linkListUrl;
    this.preVendorCode = source.preVendorCode;
  }
  setVendorCodesListFromLastDocument(codes: string[]): void {
    this.vendorCodesListFromLastDocument = codes;
  }

  async getNewLinks(): Promise<string[]> {
    console.log("Начат процесс сбора новых ссылок");

    const result = await this.assembleNewLinksList();

    console.log(
      `Закончен процесс сбора новых ссылок. Результат: ${result.length} ссылок`
    );

    return result;
  }

  private async init(): Promise<void> {
    this.page = await this.browser.openNewPage();
  }

  private async assembleNewLinksList(): Promise<string[]> {
    if (!this.vendorCodesListFromLastDocument) {
      throw Error("VendorCodesListFromLastDocument не проинициализирован!");
    }
    if (!this.preVendorCode) {
      throw Error("PreVendorCode не проинициализирован!");
    }

    let flag = false;

    async function innerGetLinks(
      vendorCodesListFromLastDocument: string[],
      getLinksFromList: (pageNumber: number) => Promise<string[]>,
      lastPage: number,
      preVendorCode: string,
      result: string[] = []
    ): Promise<string[]> {
      console.log(`Начат сбор ссылок!`);
      for (let i = 1; i < lastPage; i++) {
        if (flag) {
          break;
        }

        const links = await getLinksFromList(i);

        for (let j = 0; j < links.length; j++) {
          const link = links[j];
          // const vendorCode = (link.match(/(\d+)\/$/) as string[])[1];

          if (
            // ToDo: RETURN!!!!
            /*(vendorCodesListFromLastDocument.length &&
              !vendorCodesListFromLastDocument.includes(
                vendorCode
                  .toString()
                  .replace(new RegExp(`^${preVendorCode.toString()}`), "")
              )) ||*/
            result.length >= 9000
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

    const lastPage = await this.scrapLastPageNumber();

    return await innerGetLinks(
      this.vendorCodesListFromLastDocument,
      this.scrapLinks,
      lastPage,
      this.preVendorCode
    );
  }

  private async scrapLastPageNumber(): Promise<number> {
    await this.init();

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
      throw new Error("Не найдена панель пагинации");
    }

    const lastPage = await this.page.evaluate(
      (a) => a.textContent || "",
      lastPageTagHandles[0]
    );

    if (!lastPage) {
      throw new Error("Не найден элемент последней страницы!");
    }

    await this.dispose();

    console.log(`Номер последней страницы - ${lastPage}`);

    return parseInt(lastPage as string);
  }

  private async scrapLinks(pageNumber: number): Promise<string[]> {
    if (!this.page) {
      throw new Error("Страница не проинициализирован!");
    }
    if (!this.linkXpath) {
      throw new Error("linkXpath не проинициализировано!");
    }
    if (!this.listPageExpression) {
      throw new Error("listPageExpression не проинициализировано!");
    }

    const listPageSubStr = this.listPageExpression.replace(
      "${number}",
      pageNumber.toString()
    );

    await this.init();

    await this.page.goto(this.url + listPageSubStr, {
      waitUntil: "networkidle2",
    });

    const linksFromListHandles = await this.page.$x(this.linkXpath);

    if (!linksFromListHandles.length) {
      throw Error("Ссылки на товары не найдены!");
    }

    const result = await Promise.all(
      linksFromListHandles.map((handler) =>
        // @ts-ignore
        this.page.evaluate((a) => a.href || "", handler)
      )
    );

    await this.dispose();

    return result;
  }

  private async dispose(): Promise<void> {
    if (!this.page) {
      throw new Error("Страница не проинициализирован!");
    }

    await BrowserFacade.closePage(this.page);
  }
}
