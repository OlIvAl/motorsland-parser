import { Readable, Transform, TransformCallback } from "stream";
import { ISource } from "../../../../dataSources/interfases";
import { IBrowserFacade } from "../../../../dataSources/scrapers/interfaces";
import { LinkListScraper } from "../../../../dataSources/scrapers/LinkListScraper";

export class RequestProductLinksTransform extends Transform {
  #linkListScraper?: LinkListScraper;
  #readable: Readable = new Readable({ objectMode: true });

  constructor(private browser: IBrowserFacade) {
    super({ objectMode: true });
  }
  _construct(callback: (error?: Error | null) => void) {
    this.browser
      .init()
      .then(() => {
        this.#linkListScraper = new LinkListScraper(
          this.#readable,
          this.browser
        );
      })
      .then(() => {
        callback();
      });
  }

  async _transform(
    source: ISource,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    this.#linkListScraper?.setSource(source);

    this.#linkListScraper?.getNewLinks();

    for await (let link of this.#readable) {
      console.log("link =>", link);
      done(null, link);
    }
  }
}
