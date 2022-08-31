import { Transform, TransformCallback } from "stream";
import { IBrowserFacade } from "../../../../dataSources/scrapers/interfaces";
import { DataScraper } from "../../../../dataSources/scrapers/DataScraper";
import { IPageSource } from "../../../../dataSources/interfases";

export class DataScraperTransform extends Transform {
  #dataScraper?: DataScraper;

  constructor(private browser: IBrowserFacade) {
    super({ objectMode: true });
  }
  _construct(callback: (error?: Error | null) => void) {
    return this.browser
      .init()
      .then(() => {
        this.#dataScraper = new DataScraper(this.browser);
      })
      .then(() => {
        callback();
      });
  }
  async _transform(
    chunk: IPageSource,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    if (!this.#dataScraper) {
      throw new Error("dataScraper не проинициализировано!");
    }

    this.#dataScraper.setSource(chunk);
  }
  _flush(callback: TransformCallback) {
    this.browser.dispose().then(() => callback());
  }
}
