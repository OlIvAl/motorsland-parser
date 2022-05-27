import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { IDocumentRepository } from "../../../domain/repository/Document";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IItemData,
  IUploadingTableClient,
} from "../../../dataSources/interfases";
import { IDocumentBuilder } from "../../../dataSources/DocumentBuilder/interfaces";
import { ImageBuilder } from "../../../dataSources/ImageBuilder";
import { Document } from "../../../domain/entity/Document/structures/Document";
import { ItemsListSchema } from "../../validationSchemas/Document";
import { BadRequest } from "http-json-errors";
import { ErrCodes } from "../../../errCodes";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";

export class DocumentRepository implements IDocumentRepository {
  constructor(
    protected documentsStorage: IAzureBlobStorage,
    protected imagesStorage: IAzureBlobStorage,
    protected documentBuilder: IDocumentBuilder,
    private documentTableClient: IDocumentTableClient,
    private uploadingTableClient: IUploadingTableClient
  ) {}

  async getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]> {
    await this.documentsStorage.init();

    const result = await this.documentTableClient.getAll(uploading);

    return ItemsListSchema.cast(result);
  }

  async getDocumentWithPublicLink(name: string): Promise<IItemData[]> {
    const buffer = await this.documentsStorage.getBuffer(name);
    const json: IItemData[] = JSON.parse(buffer.toString());

    for (let i = 0; i < json.length; i++) {
      json[i].images = await Promise.all(
        json[i].images.map((link) => this.imagesStorage.getPublicURL(link))
      );
    }

    return json;
  }

  async updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    const lastDocument = await this.getLastDocument(uploading);
    const sources = await this.uploadingTableClient.getSources(uploading);

    await this.documentBuilder.dispose();
    await this.documentBuilder.initBrowser();
    this.documentBuilder.setSources(sources);
    await this.documentBuilder.setLastDocument(lastDocument);
    await this.documentBuilder.countNewLinksList();

    return this.documentBuilder.getNewLinksList().length;
  }

  async create(uploading: UPLOADING_NAME): Promise<IDocument> {
    if (await this.uploadingTableClient.isAnyInProgress()) {
      throw new BadRequest(ErrCodes.PROCESS_IS_BUSY);
    }

    try {
      await this.uploadingTableClient.setProgress(uploading);

      const lastDocument = await this.getLastDocument(uploading);
      const sources = await this.uploadingTableClient.getSources(uploading);

      await this.documentBuilder.dispose();
      await this.documentBuilder.initBrowser();
      await this.documentBuilder.setSources(sources);
      await this.documentBuilder.setLastDocument(lastDocument);

      await this.documentBuilder.countNewLinksList();

      if (this.documentBuilder.getNewLinksList().length < 50) {
        // ToDo: update new links count!
        throw new BadRequest(ErrCodes.LESS_THAN_50_ITEMS);
      }

      await this.documentBuilder.buildDocument();

      const docObj = this.documentBuilder.getDocument();

      for (let i = 0; i < docObj.length; i++) {
        docObj[i].images = await Promise.all(
          docObj[i].images.map(async (imgSrc: string) => {
            const imageBuilder = new ImageBuilder(imgSrc);
            const [fileName, buffer] = await imageBuilder.getBuffer();

            await this.imagesStorage.upload(buffer, fileName, "image/jpeg");

            return this.imagesStorage.getURL(fileName);
          })
        );
      }

      const date = new Date();

      const resp = await this.documentTableClient.add(uploading, docObj);

      return {
        ...new Document(),
        ...{
          id: resp.name,
          name: resp.name,
          createdOn: date,
        },
      };
    } finally {
      await this.uploadingTableClient.unsetProgress(uploading);
    }
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    await this.documentTableClient.delete(uploading, name);
    await this.updateNewDocumentsCount(uploading);
  }

  private async getLastDocument(
    uploading: UPLOADING_NAME
  ): Promise<IItemData[]> {
    const lastDocument = await this.documentTableClient.getLast(uploading);
    const lastDocumentName = lastDocument ? lastDocument.name : "";

    if (!lastDocumentName) {
      return [];
    }

    return JSON.parse(
      (await this.documentsStorage.getBuffer(lastDocumentName)).toString()
    ) as IItemData[];
  }
}

injected(
  DocumentRepository,
  DATA_SOURCE_REMOTE.DocumentsStorage,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.DocumentBuilder,
  DATA_SOURCE_REMOTE.DocumentTableClient,
  DATA_SOURCE_REMOTE.UploadingTableClient
);
