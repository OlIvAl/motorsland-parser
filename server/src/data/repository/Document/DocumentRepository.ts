import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { Document } from "../../../domain/entity/Document/structures/Document";
import { IDocumentRepository } from "../../../domain/repository/Document";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IItemData,
  IUploadingTableClient,
  IWatermarkSettings,
} from "../../../dataSources/interfases";
import { ImageBuilder } from "../../../dataSources/ImageBuilder";
import { ItemsListSchema } from "../../validationSchemas/Document";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { getLocalTime } from "../../../libs/getLocalTime";
import { PassThrough, Readable, Writable, pipeline } from "stream";
import { pipeline as asyncPipeline } from "stream/promises";
import { PostProcessingTransform } from "../../../dataSources/Streams/PostProcessingTransform";
import { AddImagesTransform } from "../../../dataSources/Streams/AddImagesTransform";
import { LinkListScraper } from "../../../dataSources/scrapers/LinkListScraper";
import { RequestProductLinksTransform } from "./streams/RequestProductLinksTransform";

import { connect, IResult, Table } from "mssql";
import { InsertLinksWritable } from "./streams/InsertLinksTransform";

// Todo: delete temporary files!!!!!!!!
export class DocumentRepository implements IDocumentRepository {
  constructor(
    private documentTableClient: IDocumentTableClient,
    private uploadingTableClient: IUploadingTableClient,
    private imagesStorage: IAzureBlobStorage,
    private linkListScraper: LinkListScraper
  ) {
    this.getDocuments = this.getDocuments.bind(this);
    this.getDocument = this.getDocument.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.imageFolderHandler = this.imageFolderHandler.bind(this);
  }

  async getHeaders(): Promise<Record<string, string>> {
    const result = await this.uploadingTableClient.getFields();

    return result.reduce(
      (obj, field) => ({
        ...obj,
        [field.field]: field.title,
      }),
      {}
    );
  }

  async getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]> {
    const result = await this.documentTableClient.getAll(uploading);

    return ItemsListSchema.cast(result);
  }

  async getDocument(name: string): Promise<Writable> {
    const sources = await this.documentTableClient.getSources();

    const dataGenerator = await this.documentTableClient.getDataRows(
      name.replace(".csv", "")
    );

    console.log("Start:", getLocalTime());

    return pipeline(
      Readable.from(dataGenerator, {
        objectMode: true,
      }),
      new AddImagesTransform(this.documentTableClient, this.imagesStorage),
      new PostProcessingTransform(sources),
      new PassThrough({ objectMode: true }),
      (err) => {
        if (err) {
          console.error("Failed:", err);
        } else {
          console.log("Finish:", getLocalTime());
        }
      }
    );
  }

  async create(sourceName: string): Promise<IDocument> {
    const uploadingName = `${sourceName}-${new Date().toISOString()}`;
    try {
      const pool = await connect(process.env.DB_CONNECTION_STRING as string);

      const result = pool
        .request()
        .query(
          `insert into [dbo].[uploadings] (name) values ('${uploadingName}')`
        );

      const [listLinks, listSource] = await Promise.all([
        this.uploadingTableClient.getLinks(sourceName),
        this.uploadingTableClient.getListSource(sourceName),
      ]);

      console.log("Начался процесс создания документа!");

      /*await asyncPipeline(
        Readable.from(listLinks),
        new RequestProductLinksTransform(this.linkListScraper, listSource),
        new InsertLinksWritable(
          new Table("[dbo].[meta_item_links]"),
          pool.request(),
          uploadingName
        )
      );

      const selectLinkListRequest = pool.request();
      selectLinkListRequest.stream = true;

      // @ts-ignore
      const selectStream = selectLinkListRequest.toReadableStream();

      selectLinkListRequest.query<any>(
        `select * from [dbo].[meta_item_links] where uploading_id=${uploadingName}`,
        (err, recordset) => {
          if (err) {
            throw err;
          }

          console.log(recordset);
        }
      );

      await asyncPipeline(selectStream, new PassThrough());*/

      return {
        ...new Document(),
        ...{
          id: "",
          name: "",
          createdOn: new Date(),
        },
      };
    } catch (e) {
      // await this.linkListScraper.dispose();
      console.log("Произошла ошибка! Браузер закрыт, если был открыт!");
      console.log(e);

      throw e;
    }
  }

  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    await this.documentTableClient.delete(uploading, name);
  }

  private async imageFolderHandler(
    data: IItemData,
    watermarkSettings?: IWatermarkSettings
  ): Promise<IItemData> {
    data.images = (
      await Promise.all(
        data.images.map(async (imgSrc: string) => {
          if (/nophoto.(jpe?g|png)$/.test(imgSrc)) {
            return "";
          }

          let fileName = "";
          const imageBuilder = new ImageBuilder(imgSrc, watermarkSettings);

          try {
            const [fileName, buffer] = await imageBuilder.getBuffer();
            await this.imagesStorage.upload(buffer, fileName, "image/jpeg");

            return decodeURIComponent(this.imagesStorage.getURL(fileName));
          } catch (e) {
            console.log("Возникла ошибка при обработке " + fileName);
            console.log("Артикул:" + data.vendor_code);
            console.log(e);

            return "";
          }
        })
      )
    ).filter((str) => Boolean(str));
    return data;
  }
}

injected(
  DocumentRepository,
  DATA_SOURCE_REMOTE.DocumentTableClient,
  DATA_SOURCE_REMOTE.UploadingTableClient,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.LinkListScraper
);
