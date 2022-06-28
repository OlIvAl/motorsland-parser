import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { IDocumentRepository } from "../../../domain/repository/Document";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IItemData,
  IItemSourceDictionary,
  IUploadingTableClient,
  IUsefulFieldData,
} from "../../../dataSources/interfases";
import { IDocumentBuilder } from "../../../dataSources/scrapers/interfaces";
import { ImageBuilder } from "../../../dataSources/ImageBuilder";
import { ItemsListSchema } from "../../validationSchemas/Document";
import { BadRequest } from "http-json-errors";
import { ErrCodes } from "../../../errCodes";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { Conveyor } from "../../../dataSources/scrapers/Conveyor";

// Todo: delete temporary files!!!!!!!!
export class DocumentRepository implements IDocumentRepository {
  constructor(
    private documentTableClient: IDocumentTableClient,
    private uploadingTableClient: IUploadingTableClient,
    private imagesStorage: IAzureBlobStorage,
    private tempStorage: IAzureBlobStorage,
    private documentBuilder: IDocumentBuilder
  ) {
    this.getDocuments = this.getDocuments.bind(this);
    this.getDocument = this.getDocument.bind(this);
    this.updateNewDocumentsCount = this.updateNewDocumentsCount.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.imageFolderHandler = this.imageFolderHandler.bind(this);
    this.getLastDocumentVC = this.getLastDocumentVC.bind(this);
  }

  async getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]> {
    const result = await this.documentTableClient.getAll(uploading);

    return ItemsListSchema.cast(result);
  }

  async getDocument(name: string): Promise<IItemData[]> {
    console.log(
      `${new Date().toLocaleDateString("ru", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })} Начата выборка полей`
    );
    const items = await this.documentTableClient.get(name);

    console.log(
      `${new Date().toLocaleDateString("ru", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })} Закончена выборка полей`
    );

    const conveyor = new Conveyor<IUsefulFieldData[], IItemData>(
      items,
      100,
      async (fields) => {
        const item = fields.reduce<IItemData>(
          (acc, field) => ({
            ...acc,
            [field.name]: field.value,
          }),
          { name: "", price: "", vendor_code: "", images: [] }
        );

        item.images = await this.documentTableClient.getPagePublicImages(
          item.vendor_code
        );

        // ToDo: придумать что то интереснее!!!
        // ToDo: возвращать объект какой нибудь, чтобы доп поля к item относились
        return this.postProcessingData(
          item,
          fields[0].preVendorCode,
          fields[0].markup,
          fields[0].exchangeRate
        );
      }
    );

    conveyor.setLogNumber(1000);
    conveyor.setStartHandleTime(false);

    return await conveyor.handle();
  }

  private postProcessingData(
    item: IItemData,
    preVendorCode: string,
    markup: number,
    exchangeRate: number
  ): IItemData {
    item.price = (
      (Number(item.price) + Number(item.price) * markup) *
      exchangeRate
    ).toString();
    item.vendor_code = preVendorCode + item.vendor_code;

    return item;
  }

  async updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    let count: number = 0;

    const lastDocumentVC = await this.getLastDocumentVC(uploading);
    const sources = await this.uploadingTableClient.getUploadingSources(
      uploading
    );
    this.documentBuilder.setSources(sources);

    await this.documentBuilder.dispose();
    await this.documentBuilder.init();

    console.log("Браузер открыт!");

    try {
      await this.documentBuilder.setVendorCodesListFromLastDocument(
        lastDocumentVC
      );

      await this.documentBuilder.scrapNewLinks();
      count = this.documentBuilder.getNewLinksLength();

      await this.uploadingTableClient.setNewDocumentsCount(uploading, count);
    } catch (e) {
      console.log("Произошла ошибка!");
      throw e;
    } finally {
      await this.documentBuilder.dispose();
      console.log("Браузер заткрыт!");
    }

    return count;
  }

  async create(uploading: UPLOADING_NAME): Promise<IDocument> {
    if (await this.uploadingTableClient.isAnyInProgress()) {
      throw new BadRequest(ErrCodes.PROCESS_IS_BUSY);
    }

    let docObj: IItemData[] = [];
    let dictionary: IItemSourceDictionary[] = [];

    try {
      await this.uploadingTableClient.setProgress(uploading);
      console.log("Начался процесс создания документа!");

      let newLinks: string[][] = [];

      const lastDocumentVC = await this.getLastDocumentVC(uploading);
      const sources = await this.uploadingTableClient.getUploadingSources(
        uploading
      );

      await this.documentBuilder.dispose();
      await this.documentBuilder.init();

      console.log("Браузер открыт!");

      await this.documentBuilder.setSources(sources);
      await this.documentBuilder.setVendorCodesListFromLastDocument(
        lastDocumentVC
      );

      if (
        !(await this.tempStorage.isBlobExist(`${uploading}_new_links.json`))
      ) {
        newLinks = await this.getNewLinksFromPages(uploading);
      }
      if (
        !(await this.tempStorage.isBlobExist(`${uploading}_scraped_data.json`))
      ) {
        newLinks = await this.getNewLinksFromTempStorage(uploading);
      }

      this.documentBuilder.setNewLinks(newLinks);

      if (
        !(await this.tempStorage.isBlobExist(`${uploading}_scraped_data.json`))
      ) {
        [docObj, dictionary] = await this.getDataFromPages(uploading);
      }
      if (
        !(await this.tempStorage.isBlobExist(
          `${uploading}_scraped_data_with_images.json`
        ))
      ) {
        [docObj, dictionary] = await this.getDataFromTempStorage(uploading);
      }

      await this.documentBuilder.dispose();
      console.log("Браузер заткрыт!");

      const chunkSize = 10;

      console.log(
        `Время начала: ${new Date().toLocaleDateString("ru", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}`
      );

      if (
        !(await this.tempStorage.isBlobExist(
          `${uploading}_scraped_data_with_images.json`
        ))
      ) {
        docObj = await this.getHandledData(uploading, docObj, chunkSize);
      } else {
        docObj = await this.getHandledDataFromTempStorage(uploading);
      }

      const date = new Date();

      const resp = await this.documentTableClient.addDocument(
        uploading,
        docObj,
        dictionary
      );

      console.log(`Новая выгрузка ${resp.name} добавлена в БД!`);

      await this.uploadingTableClient.setNewDocumentsCount(uploading, 0);

      await this.deleteUploadingTempFiles(uploading);

      console.log(
        `Время окончания: ${new Date().toLocaleDateString("ru", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}`
      );

      return {
        id: "",
        name: "",
        createdOn: date,
      };
    } catch (e) {
      await this.documentBuilder.dispose();
      console.log("Произошла ошибка! Браузер закрыт, если был открыт!");
      console.log(e);

      throw e;
    } finally {
      await this.uploadingTableClient.unsetProgress(uploading);
    }
  }

  private async getNewLinksFromPages(
    uploading: UPLOADING_NAME
  ): Promise<string[][]> {
    await this.documentBuilder.scrapNewLinks();

    const newLinks = this.documentBuilder.getNewLinks();

    if (this.documentBuilder.getNewLinksLength() < 50) {
      // ToDo: update new links count!
      throw new BadRequest(ErrCodes.LESS_THAN_50_ITEMS);
    }
    await this.tempStorage.upload(
      Buffer.from(JSON.stringify(newLinks)),
      `${uploading}_new_links.json`,
      "text/plain"
    );
    console.log("Список новых ссылок записан в хранилище!");

    return newLinks;
  }

  private async getNewLinksFromTempStorage(
    uploading: UPLOADING_NAME
  ): Promise<string[][]> {
    const newLinks = JSON.parse(
      (
        await this.tempStorage.getBuffer(`${uploading}_new_links.json`)
      ).toString()
    );

    console.log(
      `Список из ${newLinks.flat().length} новых ссылок взят из хранилища!`
    );

    return newLinks;
  }

  private async getDataFromPages(
    uploading: UPLOADING_NAME
  ): Promise<[IItemData[], IItemSourceDictionary[]]> {
    await this.documentBuilder.scrapData();

    const docObj = this.documentBuilder.getScrapedData();
    const dictionary = this.documentBuilder.getDictionary();

    await this.tempStorage.upload(
      Buffer.from(JSON.stringify(docObj)),
      `${uploading}_scraped_data.json`,
      "text/plain"
    );
    await this.tempStorage.upload(
      Buffer.from(JSON.stringify(dictionary)),
      `${uploading}_dictionary.json`,
      "text/plain"
    );
    console.log("Список собранных данных записан в хранилище!");

    return [docObj, dictionary];
  }

  private async getDataFromTempStorage(
    uploading: UPLOADING_NAME
  ): Promise<[IItemData[], IItemSourceDictionary[]]> {
    const docObj = JSON.parse(
      (
        await this.tempStorage.getBuffer(`${uploading}_scraped_data.json`)
      ).toString()
    );
    const dictionary = JSON.parse(
      (
        await this.tempStorage.getBuffer(`${uploading}_dictionary.json`)
      ).toString()
    );

    console.log(
      `Список из ${docObj.length} элементов собранных данных взят из хранилища!`
    );

    return [docObj, dictionary];
  }

  private async getHandledData(
    uploading: UPLOADING_NAME,
    docObj: IItemData[],
    chunkSize: number
  ): Promise<IItemData[]> {
    const conveyor = new Conveyor<IItemData, IItemData>(
      docObj,
      chunkSize,
      this.imageFolderHandler
    );

    const result = await conveyor.handle();

    await this.tempStorage.upload(
      Buffer.from(JSON.stringify(result)),
      `${uploading}_scraped_data_with_images.json`,
      "text/plain"
    );
    console.log("Список обработанных данных записан в хранилище!");

    return result;
  }

  private async getHandledDataFromTempStorage(
    uploading: UPLOADING_NAME
  ): Promise<IItemData[]> {
    const result = JSON.parse(
      (
        await this.tempStorage.getBuffer(
          `${uploading}_scraped_data_with_images.json`
        )
      ).toString()
    );

    console.log(
      `Список из ${result.length} обработанных элементов собранных данных взят из хранилища!`
    );

    return result;
  }

  private async deleteUploadingTempFiles(
    uploading: UPLOADING_NAME
  ): Promise<void> {
    if (await this.tempStorage.isBlobExist(`${uploading}_new_links.json`)) {
      await this.tempStorage.deleteBlob(`${uploading}_new_links.json`);
      console.log("Удален new_links.json после сбора данных со страниц!");
    }
    if (await this.tempStorage.isBlobExist(`${uploading}_dictionary.json`)) {
      await this.tempStorage.deleteBlob(`${uploading}_dictionary.json`);
      console.log("Удален dictionary.json после сбора данных со страниц!");
    }
    if (await this.tempStorage.isBlobExist(`${uploading}_scraped_data.json`)) {
      await this.tempStorage.deleteBlob(`${uploading}_scraped_data.json`);
      console.log(
        "Удален scraped_data.json после успешного обработки изображений!"
      );
    }
    if (
      await this.tempStorage.isBlobExist(
        `${uploading}_scraped_data_with_images.json`
      )
    ) {
      await this.tempStorage.deleteBlob(
        `${uploading}_scraped_data_with_images.json`
      );
      console.log(
        "Удален scraped_data_with_images.json после успешного добавления нового документа в БД!"
      );
    }
  }

  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    await this.documentTableClient.delete(uploading, name);
    await this.updateNewDocumentsCount(uploading);
  }

  private async imageFolderHandler(data: IItemData): Promise<IItemData> {
    data.images = (
      await Promise.all(
        data.images.map(async (imgSrc: string) => {
          const imageBuilder = new ImageBuilder(imgSrc);

          const [fileName, buffer] = await imageBuilder.getBuffer();
          try {
            await this.imagesStorage.upload(buffer, fileName, "image/jpeg");

            return decodeURIComponent(this.imagesStorage.getURL(fileName));
          } catch (e) {
            console.log("Возникла ошибка при обработке " + fileName);
            console.log(e);

            return "";
          }
        })
      )
    ).filter((str) => Boolean(str));

    return data;
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
  DATA_SOURCE_REMOTE.TempStorage,
  DATA_SOURCE_REMOTE.DocumentBuilder
);
