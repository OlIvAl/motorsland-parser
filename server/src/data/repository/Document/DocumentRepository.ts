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
    private documentTableClient: IDocumentTableClient,
    private uploadingTableClient: IUploadingTableClient,
    protected imagesStorage: IAzureBlobStorage,
    protected documentBuilder: IDocumentBuilder
  ) {}

  async getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]> {
    const result = await this.documentTableClient.getAll(uploading);

    return ItemsListSchema.cast(result);
  }

  async getDocumentWithPublicLink(name: string): Promise<IItemData[]> {
    const pageDataArr: IItemData[] = (
      await this.documentTableClient.get(name)
    ).map((fields) =>
      fields.reduce<IItemData>(
        (acc, field) => ({
          ...acc,
          [field.name]: field.value,
        }),
        { name: "", price: "", vendor_code: "", images: [] }
      )
    );

    return (
      await Promise.all(
        pageDataArr.map((item) =>
          this.documentTableClient.getPagePublicImages(item.vendor_code)
        )
      )
    ).map((images, i) => {
      pageDataArr[i].images = images;

      return pageDataArr[i];
    });
  }

  async updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    const lastDocumentVC = await this.getLastDocumentVC(uploading);
    const sources = await this.uploadingTableClient.getSources(uploading);

    await this.documentBuilder.dispose();
    await this.documentBuilder.initBrowser();
    this.documentBuilder.setSources(sources);

    await this.documentBuilder.setVendorCodesListFromLastDocument(
      lastDocumentVC
    );

    const result = await this.documentBuilder.getNewLinksCount();

    await this.uploadingTableClient.setNewDocumentsCount(uploading, result);

    await this.documentBuilder.dispose();

    return result;
  }

  async create(uploading: UPLOADING_NAME): Promise<IDocument> {
    if (await this.uploadingTableClient.isAnyInProgress()) {
      throw new BadRequest(ErrCodes.PROCESS_IS_BUSY);
    }

    try {
      await this.uploadingTableClient.setProgress(uploading);

      const lastDocumentVC = await this.getLastDocumentVC(uploading);
      const sources = await this.uploadingTableClient.getSources(uploading);

      await this.documentBuilder.dispose();
      await this.documentBuilder.initBrowser();
      await this.documentBuilder.setSources(sources);
      await this.documentBuilder.setVendorCodesListFromLastDocument(
        lastDocumentVC
      );

      if ((await this.documentBuilder.getNewLinksCount()) < 50) {
        // ToDo: update new links count!
        throw new BadRequest(ErrCodes.LESS_THAN_50_ITEMS);
      }

      await this.documentBuilder.buildDocument();

      const docObj = this.documentBuilder.getDocument();

      await this.documentBuilder.dispose();

      for (let i = 0; i < docObj.length; i++) {
        docObj[i].images = await Promise.all(
          docObj[i].images.map(async (imgSrc: string) => {
            const imageBuilder = new ImageBuilder(imgSrc);
            const [fileName, buffer] = await imageBuilder.getBuffer();

            await this.imagesStorage.upload(buffer, fileName, "image/jpeg");

            return decodeURIComponent(this.imagesStorage.getURL(fileName));
          })
        );
      }

      const date = new Date();

      const resp = await this.documentTableClient.addDocument(
        uploading,
        docObj
      );

      await this.uploadingTableClient.setNewDocumentsCount(uploading, 0);

      return {
        ...new Document(),
        ...{
          id: resp.name,
          name: resp.name,
          createdOn: date,
        },
      };

      /*return {
        id: `engines-${new Date().toISOString()}`,
        name: `engines-${new Date().toISOString()}`,
        createdOn: new Date(),
      };*/
    } finally {
      await this.uploadingTableClient.unsetProgress(uploading);
    }
  }

  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    await this.documentTableClient.delete(uploading, name);
    await this.updateNewDocumentsCount(uploading);
  }

  private async getLastDocumentVC(
    uploading: UPLOADING_NAME
  ): Promise<string[]> {
    const lastDocument = await this.documentTableClient.getLast(uploading);
    const lastDocumentName = lastDocument ? lastDocument.name : "";

    if (!lastDocumentName) {
      return [];
    }

    let vcSet = new Set<string>();

    const documentInfo = await this.documentTableClient.get(lastDocumentName);
    documentInfo.forEach((fieldInfo) => {
      fieldInfo.forEach((field) => {
        if (field.name === "vendor_code") {
          vcSet.add(field.value as string);
        }
      });
    });

    return Array.from(vcSet);
  }
}

injected(
  DocumentRepository,
  DATA_SOURCE_REMOTE.DocumentTableClient,
  DATA_SOURCE_REMOTE.UploadingTableClient,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.DocumentBuilder
);
