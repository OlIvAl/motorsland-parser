import Puppeteer, { Browser, Page } from "puppeteer";
import { IBrowserFacade } from "./interfaces";
import UserAgent from "user-agents";

export class BrowserFacade implements IBrowserFacade {
  private browser?: Browser;

  async init(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      this.browser = await Puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`,
        defaultViewport: null,
      });
    } else {
      this.browser = await Puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--js-flags=--expose-gc",
          "--single-process",
          "--no-zygote",
        ],
      });
    }
  }
  async openNewPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error("Браузер не проинициализирован!");
    }

    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font", "script"].includes(
          request.resourceType()
        ) ||
        !/^https:\/\/motorlandby/.test(request.url())
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setUserAgent(UserAgent.toString());

    return page;
  }
  static async closePage(page: Page): Promise<void> {
    await page.evaluate(() => {
      if (window && typeof window.gc === "function") {
        window.gc();
      }
    });

    await page.close();
  }
  async dispose(): Promise<void> {
    if (!this.browser) {
      throw new Error("Браузер не проинициализирован!");
    }

    await this.browser.close();
  }
}
