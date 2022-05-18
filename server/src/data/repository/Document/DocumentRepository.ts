import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import {
  IAzureBlobStorage,
  INewDocumentsCountTableClient,
  IProgressTableClient,
} from "../../../dataSources/interfases";
import { IDocumentBuilder } from "../../../dataSources/DocumentBuilder/interfaces";
import { ImageBuilder } from "../../../dataSources/ImageBuilder";
import { Document } from "../../../domain/entity/Document/structures/Document";
import { BlobClient } from "@azure/storage-blob";
import { AzureBlobStorage } from "../../../dataSources/AzureBlobStorage";
import { create } from "xmlbuilder2";
import { ID } from "../../../interfaces";
import { ItemsListSchema } from "../../validationSchemas/Document";
import { CONTAINER_NAME } from "../../../constants";
import { BadRequest } from "http-errors";
import { ErrCodes } from "../../../errCodes";

export abstract class DocumentRepository implements IDocumentRepository {
  protected abstract storage: CONTAINER_NAME;

  constructor(
    protected documentsStorage: IAzureBlobStorage,
    protected imagesStorage: IAzureBlobStorage,
    protected documentsBuilder: IDocumentBuilder,
    protected progressTableClient: IProgressTableClient,
    protected newDocumentsCountTableClient: INewDocumentsCountTableClient
  ) {}

  async getDocuments(): Promise<IDocument[]> {
    await this.documentsStorage.init();

    const result = await this.documentsStorage.getItemsList();

    return ItemsListSchema.cast(result);
  }

  async getProgress(): Promise<boolean> {
    return await this.progressTableClient.getProgress(this.storage);
  }

  async getNewDocumentsCount(): Promise<number> {
    return await this.newDocumentsCountTableClient.getNewDocumentsCount(
      this.storage
    );
  }

  async updateNewDocumentsCount(): Promise<number> {
    const lastDocument = await this.getLastDocument();

    await this.documentsBuilder.initBrowser();
    await this.documentsBuilder.setLastDocument(lastDocument);

    const result = this.documentsBuilder.getNewLinksList();

    await this.documentsBuilder.dispose();

    await this.newDocumentsCountTableClient.setNewDocumentsCount(
      this.storage,
      result.length
    );

    return result.length;
  }

  async create(fields: Record<string, string>): Promise<IDocument> {
    if (await this.progressTableClient.isAnyInProgress()) {
      throw new BadRequest(ErrCodes.PROCESS_IS_BUSY);
    }

    try {
      await this.progressTableClient.setProgress(this.storage);

      const lastDocument = await this.getLastDocument();

      await this.documentsBuilder.initBrowser();
      await this.documentsBuilder.setLastDocument(lastDocument);

      if (this.documentsBuilder.getNewLinksList().length < 50) {
        throw new BadRequest(ErrCodes.LESS_THAN_50_ITEMS);
      }

      const docObj = await this.documentsBuilder.buildDocument(fields);

      for (let i = 0; i < docObj.offers.offer.length; i++) {
        docObj.offers.offer[i].images.image = await Promise.all(
          docObj.offers.offer[i].images.image.map(async (imgSrc: string) => {
            const imageBuilder = new ImageBuilder(imgSrc);
            const [fileName, buffer] = await imageBuilder.getBuffer();

            await this.imagesStorage.upload(buffer, fileName, "image/jpeg");

            return await this.imagesStorage.getPublicURL(fileName);
          })
        );
      }

      const docXML = create(docObj)
        .dec({ encoding: "UTF-8" })
        .end({ prettyPrint: true });

      const fileName = `uploading-${new Date().toISOString()}.xml`;

      const resp = await this.documentsStorage.upload(
        Buffer.from(docXML),
        fileName,
        "application/xml"
      );

      await this.documentsBuilder.dispose();

      const publicURL = await this.documentsStorage.getPublicURL(fileName);

      return {
        ...new Document(),
        ...{
          id: fileName,
          name: fileName,
          createdOn: resp.date as Date,
          publicURL,
        },
      };
    } finally {
      await this.progressTableClient.unsetProgress(this.storage);
    }
  }
  async delete(id: ID): Promise<void> {
    const document = (
      await this.documentsStorage.getBuffer(id as string)
    ).toString();

    const blobNames = (document.match(/(\/images\/[\w\d%_]+.jpg)+/g) || []).map(
      (str) => str.replace("/images/", "").replace("%2F", "/")
    );

    const blobClients = blobNames.map(
      (name) =>
        new BlobClient(
          AzureBlobStorage.AZURE_STORAGE_CONNECTION_STRING,
          "images",
          name
        )
    );

    await this.imagesStorage.deleteBlobs(blobClients);
    await this.documentsStorage.deleteBlob(id as string);
    await this.updateNewDocumentsCount();
  }

  private async getLastDocument(): Promise<string> {
    const lastDocumentNames = await this.documentsStorage.getItemsList();
    const lastDocumentName = lastDocumentNames.length
      ? lastDocumentNames.slice(-1)[0].name
      : "";

    return lastDocumentName
      ? (await this.documentsStorage.getBuffer(lastDocumentName)).toString()
      : "";
  }
}
