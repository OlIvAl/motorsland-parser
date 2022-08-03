import { Readable, Transform, TransformCallback } from "stream";
import { ISource, ISourceOfCategory } from "../../../../dataSources/interfases";
import { IBrowserFacade } from "../../../../dataSources/scrapers/interfaces";
import { LinkListScraper } from "../../../../dataSources/scrapers/LinkListScraper";

export class RequestProductLinksTransform extends Transform {
  #linkListScraper?: LinkListScraper;

  constructor(private browser: IBrowserFacade) {
    super({ objectMode: true });
  }
  _construct(callback: (error?: Error | null) => void) {
    return this.browser
      .init()
      .then(() => {
        this.#linkListScraper = new LinkListScraper(this.browser);
      })
      .then(() => {
        callback();
      });
  }

  async _transform(
    source: ISourceOfCategory,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    if (!this.#linkListScraper) {
      throw new Error("linkListScraper не проинициализировано!");
    }

    this.#linkListScraper.setSource(source);

    const generator = await this.#linkListScraper.getNewLinks();

    for await (let link of generator) {
      console.log("link => ", link);
      done(null, link);
    }
  }
}
