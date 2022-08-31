import { Transform, TransformCallback } from "stream";
import { IListSource } from "../../../../dataSources/interfases";
import { LinkListScraper } from "../../../../dataSources/scrapers/LinkListScraper";

export class RequestProductLinksTransform extends Transform {
  constructor(
    private linkListScraper: LinkListScraper,
    private listSource: IListSource
  ) {
    super({ objectMode: true });
  }
  _construct(callback: (error?: Error | null) => void) {
    return this.linkListScraper.init().then(() => {
      this.linkListScraper.setSource(this.listSource);
      callback();
    });
  }

  async _transform(
    url: string,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    for await (let links of this.linkListScraper.getNewLinks(url)) {
      links.forEach((link) => this.push(link));
    }

    done();
  }
  _flush(callback: TransformCallback) {
    this.linkListScraper.dispose().then(() => callback());
  }
}
