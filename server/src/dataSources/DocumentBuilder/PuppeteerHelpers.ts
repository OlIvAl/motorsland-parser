import { Browser, Page } from "puppeteer";
import UserAgent from "user-agents";

export class PuppeteerHelpers {
  static async getNewPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    await PuppeteerHelpers.optimizePageLoading(page);

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
  private static async optimizePageLoading(page: Page): Promise<void> {
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
  }
}
