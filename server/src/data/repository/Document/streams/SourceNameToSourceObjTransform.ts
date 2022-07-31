import { Transform, TransformCallback } from "stream";
import {
  ISource,
  IUploadingTableClient,
  IWatermarkSettings,
} from "../../../../dataSources/interfases";

export class SourceNameToSourceObjTransform extends Transform {
  constructor(private uploadingTableClient: IUploadingTableClient) {
    super({ objectMode: true });
  }
  _transform(
    source: string,
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    Promise.all([
      this.uploadingTableClient.getSources(source),
      this.uploadingTableClient.getLinks(source),
      this.uploadingTableClient.getWatermarkSettings(source),
    ]).then(
      ([source, links, watermarkSettings]: [
        ISource,
        string[],
        IWatermarkSettings | undefined
      ]) => {
        source.linkListUrls = links;
        source.watermarkSettings = watermarkSettings;

        done(null, source);
      }
    );
  }
}
