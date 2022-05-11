import {
  IProductFacade,
  IAzureBlobStorageContainer,
  IDocumentInfo,
} from "./interfases";
import { AzureBlobStorageContainer } from "./AzureBlobStorageContainer";
import { DocumentBuilder } from "./DocumentBuilder/DocumentBuilder";
import { ImageBuilder } from "./ImageBuilder";
import { create } from "xmlbuilder2";
import { BlobClient } from "@azure/storage-blob";
import { CONTAINER_NAME } from "./constants";

export class ProductFacade implements IProductFacade {
  private imagesContainer: IAzureBlobStorageContainer;
  private documentsContainer: IAzureBlobStorageContainer;

  constructor(private url: string, documentsContainerName: CONTAINER_NAME) {
    this.imagesContainer = new AzureBlobStorageContainer(
      CONTAINER_NAME.IMAGES_CONTAINER_NAME
    );
    this.documentsContainer = new AzureBlobStorageContainer(
      documentsContainerName
    );
  }

  async getDocumentsInfo(): Promise<IDocumentInfo[]> {
    await this.documentsContainer.init();

    return await this.documentsContainer.getItemsList();
  }
  async getNewItemsCount(): Promise<number> {
    const lastDocumentNames = await this.documentsContainer.getItemsList();
    const lastDocumentName = lastDocumentNames.length
      ? lastDocumentNames.slice(-1)[0].name
      : "";
    const lastDocument = (
      await this.documentsContainer.getBuffer(lastDocumentName)
    ).toString();

    const documentBuilder = new DocumentBuilder(this.url);
    await documentBuilder.initBrowser();
    await documentBuilder.setLastDocument(lastDocument);

    const result = await documentBuilder.getNewLinksList();

    await documentBuilder.dispose();

    return result.length;
  }
  async uploadNewDocument(): Promise<void> {
    const documentBuilder = new DocumentBuilder(this.url);
    await documentBuilder.initBrowser();
    // ToDo: get last document
    await documentBuilder.setLastDocument("");
    const docObj = await documentBuilder.buildDocument();

    if (docObj.offers.offer.length < 50) {
      return undefined;
    }

    for (let i = 0; i < docObj.offers.offer.length; i++) {
      docObj.offers.offer[i].images.image = await Promise.all(
        docObj.offers.offer[i].images.image.map(async (imgSrc) => {
          const imageBuilder = new ImageBuilder(imgSrc);
          const [fileName, buffer] = await imageBuilder.getBuffer();

          await this.imagesContainer.upload(buffer, fileName, "image/jpeg");

          return await this.imagesContainer.getPublicURL(fileName);
        })
      );
    }

    const docXML = create(docObj)
      .dec({ encoding: "UTF-8" })
      .end({ prettyPrint: true });

    await this.documentsContainer.upload(
      Buffer.from(docXML),
      "uploading-" + new Date().toISOString(),
      "application/xml"
    );

    await documentBuilder.dispose();
  }
  async downloadDocument(name: string): Promise<Buffer> {
    return await this.documentsContainer.getBuffer(name);
  }
  async deleteDocument(name: string): Promise<void> {
    const document = (await this.documentsContainer.getBuffer(name)).toString();

    const blobNames = (document.match(/(\/images\/[\w\d%_]+.jpg)+/g) || []).map(
      (str) => str.replace("/images/", "").replace("%2F", "/")
    );

    const blobClients = blobNames.map(
      (name) =>
        new BlobClient(
          AzureBlobStorageContainer.AZURE_STORAGE_CONNECTION_STRING,
          "images",
          name
        )
    );

    await this.imagesContainer.deleteBlobs(blobClients);
    await this.documentsContainer.deleteBlob(name);
  }
  async getDocumentPublicURL(name: string): Promise<string> {
    return await this.documentsContainer.getPublicURL(name);
  }
}
