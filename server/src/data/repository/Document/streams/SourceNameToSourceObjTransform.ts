import { Transform, TransformCallback } from "stream";
import {
  IFieldSelector,
  ISource,
  ISourceOfCategory,
  ITableField,
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
      this.uploadingTableClient.getFieldSelectorsBySource(source),
    ]).then(
      ([source, links, watermarkSettings, fields]: [
        ISource,
        string[],
        IWatermarkSettings | undefined,
        IFieldSelector[]
      ]) => {
        source.linkListUrls = links;
        source.watermarkSettings = watermarkSettings;
        source.fields = fields;

        const sourceOfCategoryArr = source.linkListUrls.map<ISourceOfCategory>(
          (link) => {
            const { linkListUrls, ...data } = source;

            return {
              ...data,
              linkListUrl: data.site + link,
            };
          }
        );

        for (let sourceOfCategory of sourceOfCategoryArr) {
          done(null, sourceOfCategory);
        }
      }
    );
  }
}
