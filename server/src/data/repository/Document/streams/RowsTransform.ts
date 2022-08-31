import { Transform, TransformCallback } from "stream";

export class RowsTransform extends Transform {
  constructor(private uploading: string, private siteId: string) {
    super({ objectMode: true });
  }

  _transform(link: string, encoding: BufferEncoding, done: TransformCallback) {
    this.push({
      uploading_id: this.uploading,
      site_id: this.siteId,
      url: link,
    });

    done();
  }
}
