import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
  TableEntityResult,
} from "@azure/data-tables";
import { BlobClient } from "@azure/storage-blob";
import { CONTAINER_NAME, UPLOADING_NAME } from "../constants";
import {
  IAzureBlobStorage,
  IDocumentInfo,
  IDocumentTableClient,
  IFieldData,
  IItemData,
  IItemSourceDictionary,
  ITableDocumentField,
  ITableDocumentSourceRelation,
  ITableImage,
  ITableSource,
  IUsefulFieldData,
} from "./interfases";
import { Conveyor } from "../libs/Conveyor";
import { getLocalTime } from "../libs/getLocalTime";

export class DocumentTableClient implements IDocumentTableClient {
  private documentTableClient: TableClient;
  private documentFieldTableClient: TableClient;
  private documentSourceRelationTableClient: TableClient;
  private imagesTableClient: TableClient;
  private sourceTableClient: TableClient;

  constructor(private imagesStorage: IAzureBlobStorage) {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.documentTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "document",
      credential
    );
    this.documentFieldTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "documentField",
      credential
    );
    this.imagesTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "images",
      credential
    );
    this.documentSourceRelationTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "documentSourceRelation",
      credential
    );
    this.sourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "source",
      credential
    );
  }

  async get(name: string): Promise<IUsefulFieldData[][]> {
    const [sourcesRecord, dictionaryRecord] = await Promise.all([
      (async (): Promise<
        Record<
          string,
          Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
        >
      > => {
        const sources =
          await this.sourceTableClient.listEntities<ITableSource>();

        let sourcesRec: Record<
          string,
          Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
        > = {};

        for await (const source of sources) {
          sourcesRec = {
            ...sourcesRec,
            ...{
              [source.rowKey as string]: {
                preVendorCode: source.preVendorCode as string,
                markup: source.markup,
                exchangeRate: source.exchangeRate,
              },
            },
          };
        }
        return sourcesRec;
      })(),
      (async (): Promise<Record<string, string>> => {
        const dictionaries =
          await this.documentSourceRelationTableClient.listEntities<ITableDocumentSourceRelation>(
            {
              queryOptions: { filter: odata`document eq ${name}` },
            }
          );

        let dictionaryRec: Record<string, string> = {};

        for await (let dictionary of dictionaries) {
          dictionaryRec = {
            ...dictionaryRec,
            [dictionary.rowKey as string]: dictionary.partitionKey as string,
          };
        }

        return dictionaryRec;
      })(),
    ]);

    const fields =
      await this.documentFieldTableClient.listEntities<ITableDocumentField>({
        queryOptions: { filter: odata`document eq ${name}` },
      });

    let acc: Record<string, IUsefulFieldData[]> = {};

    // Separate by vendor code
    for await (let field of fields) {
      // ToDo: придумать что то интереснее!!!
      const usefulField: IUsefulFieldData = {
        name: field.name,
        value: field.value,
        preVendorCode:
          sourcesRecord[dictionaryRecord[field.partitionKey as string]]
            .preVendorCode,
        markup:
          sourcesRecord[dictionaryRecord[field.partitionKey as string]].markup,
        exchangeRate:
          sourcesRecord[dictionaryRecord[field.partitionKey as string]]
            .exchangeRate,
      };

      if ((field.partitionKey as string) in acc) {
        acc[field.partitionKey as string] = [
          ...acc[field.partitionKey as string],
          usefulField,
        ];
      } else {
        acc[field.partitionKey as string] = [usefulField];
      }
    }

    return Object.values<IUsefulFieldData[]>(acc);
  }
  async getPagePublicImages(vcId: string): Promise<string[]> {
    const result = await this.imagesTableClient.listEntities<ITableImage>({
      queryOptions: { filter: odata`PartitionKey eq ${vcId}` },
    });

    let arr: string[] = [];

    for await (const item of result) {
      arr.push(item.name);
    }

    return await Promise.all(
      arr.map((name) => this.imagesStorage.getPublicURL(name))
    );
  }
  async getAll(uploading: UPLOADING_NAME): Promise<IDocumentInfo[]> {
    const result = await this.documentTableClient.listEntities<{}>({
      queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
    });

    let arr = [];

    for await (const item of result) {
      arr.push({
        name: item.rowKey as string,
        createdOn: new Date(item.timestamp as string),
      });
    }

    return arr;
  }
  async getLast(uploading: UPLOADING_NAME): Promise<IDocumentInfo | null> {
    const result = await this.documentTableClient.listEntities<{}>({
      queryOptions: { filter: odata`PartitionKey eq ${uploading}` },
    });

    // for await (item of result) {}

    let arr = [];

    for await (const item of result) {
      arr.push(item);
    }

    if (!arr.length) {
      return null;
    }

    const lastItem = arr[arr.length - 1];

    return {
      name: lastItem.rowKey as string,
      createdOn: new Date(lastItem.timestamp as string),
    };
  }
  async addDocument(
    uploading: UPLOADING_NAME,
    document: IItemData[],
    dictionary: IItemSourceDictionary[]
  ): Promise<IDocumentInfo> {
    console.log(`${getLocalTime()} Начато сохранение документа!`);

    // ToDo: сохранять имя в хранилище
    const fileName = `${uploading}-${new Date().toISOString()}`;

    const dataFromPages: IFieldData[][] = document.map((itemData) => {
      const { images, ...info } = itemData;

      return Object.entries(info).map(([key, value]) => ({
        name: key,
        value,
      }));
    });

    console.log("Начато сохранение картинок!");

    // ToDo: использовать транзакции
    const imagesConveyor = new Conveyor<IItemData, void>(
      document,
      100,
      async (row) => {
        await Promise.all(
          row.images.map((src) => {
            const regexpResult = src.match(
              /[\d\w]+\/[\d\w_\)\(\-\+,]+.(jpe?g|png)$/gi
            ) as RegExpMatchArray;
            if (!regexpResult) {
              throw new Error(`Ошибка при парсинге ${src}!!!`);
            }
            const name = regexpResult[0];
            return this.imagesTableClient.createEntity<ITableImage>({
              partitionKey: row.vendor_code,
              rowKey: encodeURIComponent(name),
              url: src,
              name: name,
              document: fileName,
            });
          })
        );
      }
    );
    imagesConveyor.setLogNumber(1000);
    imagesConveyor.setStartHandleTime(false);
    await imagesConveyor.handle();

    console.log(
      `${getLocalTime()} Сохранение картинок завершилось успешно! Сохранено ${
        document.length
      } элементов`
    );
    console.log("Начато сохранение данных полей!");
    const fieldDataConveyor = new Conveyor<IFieldData[], void>(
      dataFromPages,
      100,
      async (row) => {
        const vendorCodeIndex = row.findIndex(
          (field) => field.name === "vendor_code"
        ) as number;
        const vendorCode = row[vendorCodeIndex].value as string;

        await Promise.all(
          row.map((field) => {
            try {
              return this.documentFieldTableClient.createEntity<ITableDocumentField>(
                {
                  partitionKey: vendorCode,
                  rowKey: field.name,
                  name: field.name,
                  value: field.value,
                  document: fileName,
                }
              );
            } catch (e) {
              console.log("error data => ", vendorCode, field.name);
              throw e;
            }
          })
        );
      }
    );
    fieldDataConveyor.setLogNumber(1000);
    fieldDataConveyor.setStartHandleTime(false);
    await fieldDataConveyor.handle();

    const dictionaryConveyor = new Conveyor<IItemSourceDictionary, void>(
      dictionary,
      100,
      async (row) => {
        try {
          await this.documentSourceRelationTableClient.createEntity<ITableDocumentSourceRelation>(
            {
              partitionKey: row.sourceName,
              rowKey: row.vendorCode,
              document: fileName,
            }
          );
        } catch (e) {
          console.log("error data => ", row.sourceName, row.vendorCode);
          throw e;
        }
      }
    );
    dictionaryConveyor.setLogNumber(1000);
    dictionaryConveyor.setStartHandleTime(false);
    await dictionaryConveyor.handle();

    console.log(
      `${getLocalTime()} Сохранение данных полей товаров завершилось успешно! Сохранено ${
        dataFromPages.length
      } элементов`
    );
    const createDocumentResponse =
      await this.documentTableClient.createEntity<{}>({
        partitionKey: uploading,
        rowKey: fileName,
      });
    console.log("Сохранение информации о документе завершилось успешно!");

    return {
      name: fileName,
      createdOn: createDocumentResponse.date,
    };
  }
  async delete(uploading: UPLOADING_NAME, name: string): Promise<void> {
    const [imagesSelectResult, documentFieldsSelectResult, dictionaryResult] =
      await Promise.all([
        this.imagesTableClient.listEntities<ITableImage>({
          queryOptions: { filter: odata`document eq ${name}` },
        }),
        this.documentFieldTableClient.listEntities<ITableDocumentField>({
          queryOptions: { filter: odata`document eq ${name}` },
        }),
        this.documentSourceRelationTableClient.listEntities<ITableDocumentSourceRelation>(
          {
            queryOptions: { filter: odata`document eq ${name}` },
          }
        ),
      ]);

    let names: string[] = [];
    let imagesKeysPairs: { partitionKey: string; rowKey: string }[] = [];
    for await (const item of imagesSelectResult) {
      names.push(item.name as string);
      imagesKeysPairs.push({
        partitionKey: item.partitionKey as string,
        rowKey: item.rowKey as string,
      });
    }

    let documentFieldsKeysPairs: { partitionKey: string; rowKey: string }[] =
      [];
    for await (const item of documentFieldsSelectResult) {
      documentFieldsKeysPairs.push({
        partitionKey: item.partitionKey as string,
        rowKey: item.rowKey as string,
      });
    }

    let dictionaryFieldsKeysPairs: { partitionKey: string; rowKey: string }[] =
      [];
    for await (const item of dictionaryResult) {
      dictionaryFieldsKeysPairs.push({
        partitionKey: item.partitionKey as string,
        rowKey: item.rowKey as string,
      });
    }

    console.log("Сбор данных о полях документа и картинках завершен!");

    const blobClients = names.map(
      (name) =>
        new BlobClient(
          process.env.AZURE_STORAGE_CONNECTION_STRING as string,
          CONTAINER_NAME.IMAGES_CONTAINER_NAME,
          name
        )
    );

    await this.imagesStorage.deleteBlobs(blobClients);

    console.log("Картинки удалены успешно!");

    const documentFieldConveyor = new Conveyor<
      { partitionKey: string; rowKey: string },
      void
    >(documentFieldsKeysPairs, 100, async (keysPair) => {
      await this.documentFieldTableClient.deleteEntity(
        keysPair.partitionKey,
        keysPair.rowKey
      );
    });
    const documentSourceRelationConveyor = new Conveyor<
      { partitionKey: string; rowKey: string },
      void
    >(dictionaryFieldsKeysPairs, 100, async (keysPair) => {
      await this.documentSourceRelationTableClient.deleteEntity(
        keysPair.partitionKey,
        keysPair.rowKey
      );
    });
    const imagesConveyor = new Conveyor<
      { partitionKey: string; rowKey: string },
      void
    >(imagesKeysPairs, 100, async (keysPair) => {
      await this.imagesTableClient.deleteEntity(
        keysPair.partitionKey,
        keysPair.rowKey
      );
    });

    imagesConveyor.setLogNumber(10000);
    await imagesConveyor.handle();

    documentFieldConveyor.setLogNumber(1000);
    await documentFieldConveyor.handle();

    documentSourceRelationConveyor.setLogNumber(1000);
    await documentSourceRelationConveyor.handle();

    await this.documentTableClient.deleteEntity(uploading, name);

    console.log("Остальные данные о документе удалены успешно!");
  }

  async migrate(): Promise<void> {
    // update price
    /*const uploading = "transmissions";

    const tempStorage = new AzureBlobStorage(
      CONTAINER_NAME.TEMP_CONTAINER_NAME
    );

    const fAvtoLinks: string[] = JSON.parse(
      (await tempStorage.getBuffer(`${uploading}_new_links.json`)).toString()
    )[2];

    console.log(`Взято ${fAvtoLinks.length} ссылок`);

    const browser = new BrowserFacade();
    await browser.init();

    const conveyor = new Conveyor<
      string,
      { vendor_code?: string; price?: string }
    >(fAvtoLinks, 10, async (link) => {
      const page = await browser.openNewPage();

      await page.setCookie({
        name: "from_country",
        value: "RU",
        domain: "f-avto.by",
        path: "/",
      });

      await page.goto(link, {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      const [price, vendorCode] = await Promise.all([
        DataScraper.getFieldBySelector(page, {
          field: "price",
          xpath: '//form[@id="orderdetail"]//span[@class="goods_price"]/text()',
          regexp: "/^\\d+/",
          cleanRegexp: "/[^\\d\\.]/g",
        }),
        DataScraper.getFieldBySelector(page, {
          field: "vendor_code",
          xpath:
            '//form[@id="orderdetail"]//table[@class="send-order-form"]//td[@class="goods_label"]/b/text()',
        }),
      ]);

      await BrowserFacade.closePage(page);

      if (!vendorCode.vendor_code) {
        return {
          vendor_code: undefined,
          price: undefined,
        };
      }

      return {
        ...vendorCode,
        ...price,
      };
    });

    conveyor.setStartHandleTime(false);
    const arr = await conveyor.handle();

    console.log(arr);

    await browser.dispose();

    const updateConveyor = new Conveyor<
      { vendor_code?: string; price?: string },
      void
    >(arr, 100, async (obj) => {
      if (!obj.vendor_code || !obj.price) {
        return undefined;
      }

      try {
        await this.documentFieldTableClient.updateEntity<
          Partial<ITableDocumentField>
        >(
          {
            partitionKey: obj.vendor_code,
            rowKey: "price",
            name: "price",
            value: obj.price,
          },
          "Merge"
        );
      } catch (e) {
        console.log("Error => ", obj.vendor_code, obj.price);
      }
    });

    updateConveyor.setStartHandleTime(false);
    await updateConveyor.handle();
    /* const rows = await this.imagesTableClient.listEntities<ITableDocumentField>(
      {
        queryOptions: {
          filter: odata`document eq 'backlamps-2022-06-26T18:28:11.225Z'`,
        },
      }
    );

    console.log(getLocalTime(), "Start!");

    let arr = [];
    let i = 0;
    for await (let row of rows) {
      arr.push(row);
      i = i + 1;

      if (i % 1000 === 0) {
        console.log(`Собрано ${i}  элементов`);
      }
    }

    const deleteConveyor = new Conveyor<
      TableEntityResult<ITableDocumentSourceRelation>,
      void
    >(arr, 100, async (row) => {
      await this.imagesTableClient.deleteEntity(
        row.partitionKey as string,
        row.rowKey as string
      );
    });

    deleteConveyor.setLogNumber(1000);
    deleteConveyor.setStartHandleTime(false);
    await deleteConveyor.handle();
    //
    /*for await (let row of rows) {
      arr.push(row.partitionKey as string);
    }

    console.log("arr.length => ", arr.length);*/
    /*const deleteConveyor = new Conveyor<
      TableEntityResult<ITableDocumentSourceRelation>,
      void
    >(arr, 100, async (row) => {
      await this.documentSourceRelationTableClient.deleteEntity(
        row.partitionKey as string,
        row.rowKey as string
      );
    });

    await deleteConveyor.handle();
    /*const createConveyor = new Conveyor<
      TableEntityResult<ITableDocumentSourceRelation>,
      void
    >(arr, 100, async (row) => {
      await this.documentSourceRelationTableClient.createEntity<ITableDocumentSourceRelation>(
        {
          partitionKey: row.partitionKey as string,
          rowKey: row.rowKey as string,
          document: row.document,
        }
      );
    });

    await createConveyor.handle();*/
    /*let set: Set<string> = new Set();

    let j: number = 0;
    for await (const row of rows) {
      set.add(row.partitionKey as string);

      if (j % 1000 === 0) {
        console.log(`Забрано ${j} строк`);
      }
      j = j + 1;
    }

    let arr: TableEntityResult<{}>[] = [];
    set.forEach((key) => {
      arr.push({
        partitionKey: "motorlandby.ru",
        rowKey: key,
        etag: "",
      });
    });

    console.log(`Всего ${arr.length} строк`);

    const conveyor = new Conveyor<TableEntityResult<{}>, void>(
      arr,
      100,
      async (row) => {
        await this.documentSourceRelationTableClient.createEntity({
          partitionKey: row.partitionKey as string,
          rowKey: row.rowKey as string,
        });
      }
    );

    await conveyor.handle();*/
    /*const tempStorage = new AzureBlobStorage(CONTAINER_NAME.TEMP_CONTAINER_NAME);

    await tempStorage.upload(
      Buffer.from(JSON.stringify(arr)),
      `arr.json`,
      "text/plain"
    );*/
    /*const conveyor = new Conveyor<TableEntityResult<ITableDocumentField>, void>(
      arr,
      100,
      async (row) => {
        await this.documentFieldTableClient.deleteEntity(
          row.partitionKey as string,
          row.rowKey as string
        );
      }
    );

    await conveyor.handle();*/
    /*for (let i = 0; i < arr.length; i++) {
      const row = arr[i];

      if (i % 1000 === 0) {
        console.log(`Удалено ${i} строк`);
      }
    }*/
    /*for (let i = 0; i < arr.length; i++) {
      const row = arr[i];
      await this.documentFieldTableClient.createEntity<ITableDocumentField>({
        partitionKey: (row.value as string).replace("001", ""),
        rowKey: row.name,
        name: row.name,
        value: (row.value as string).replace("001", ""),
        document: row.document as string,
      });

      if (i % 1000 === 0) {
        console.log(`Добавлено ${i} строк`);
      }
    }*/
    /*const options = {
      objectMode: true,
      delimiter: ",",
      quote: null,
      headers: true,
      renameHeaders: false,
      discardUnmappedColumns: true,
    };

    const data: any[] = [];

    const readableStream = fs.createReadStream(CSV_FILE);

    parseStream(readableStream, options)
      .on("error", (error: any) => {
        console.log(error);
      })
      .on("data", (row: any) => {
        data.push({
          partitionKey: (row.PartitionKey as string).replace("001", ""),
          rowKey: row.name,
          name: row.name,
          value:
            row.value && /^001/.test(row.value)
              ? (row.value as string).replace("001", "")
              : row.value,
          document: row.document as string,
        });
      })
      .on("end", async (rowCount: number) => {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          await this.documentFieldTableClient.createEntity<ITableDocumentField>(
            {
              partitionKey: row.partitionKey,
              rowKey: row.rowKey,
              name: row.name,
              value: row.value,
              document: row.document,
            }
          );

          if (i % 1000 === 0) {
            console.log(`Добавлено ${i} строк`);
          }
        }

        console.log(`Добавлено ${rowCount} строк`);
      });*/
    /*const imagesTableActions: CreateDeleteEntityAction[] = document
      .reduce<TableEntity<ITableImage>[]>(
        (itemRows, item) => [
          ...itemRows,
          ...item.images.map<TableEntity<ITableImage>>((src) => {
            const name = (
              src.match(/[\d\w]+\/[\d\w_-]+.(jpe?g|png)$/g) as string[]
            )[0];
            return {
              partitionKey: item.vendor_code,
              rowKey: encodeURIComponent(name),
              url: src,
              name: name,
              document: fileName,
            };
          }),
        ],
        []
      )
      .map<CreateDeleteEntityAction>((tableEntity) => [
        "create",
        tableEntity as any,
      ]);

    const documentFieldTableActions: CreateDeleteEntityAction[] = dataFromPages
      .reduce<TableEntity<IFieldData>[]>((rows, row) => {
        const vendorCodeIndex = row.findIndex(
          (field) => field.name === "vendor_code"
        ) as number;
        const vendorCode = row[vendorCodeIndex].value as string;

        return [
          ...rows,
          ...row.map<TableEntity<IFieldData>>((field) => ({
            partitionKey: vendorCode,
            rowKey: field.name,
            name: field.name,
            value: field.value,
            document: fileName,
          })),
        ];
      }, [])
      .map<CreateDeleteEntityAction>((tableEntity) => [
        "create",
        tableEntity as any,
      ]);

    const documentSourceRelationTableActions: CreateDeleteEntityAction[] =
      dictionary
        .reduce<TableEntity<ITableDocumentSourceRelation>[]>(
          (rows, row) => [
            ...rows,
            {
              partitionKey: row.sourceName,
              rowKey: row.vendorCode,
              document: fileName,
            },
          ],
          []
        )
        .map<CreateDeleteEntityAction>((tableEntity) => [
          "create",
          tableEntity as any,
        ]);

    await Promise.all([
      this.imagesTableClient.submitTransaction(imagesTableActions),
      this.documentFieldTableClient.submitTransaction(
        documentFieldTableActions
      ),
      this.documentSourceRelationTableClient.submitTransaction(
        documentSourceRelationTableActions
      ),
    ]);*/
    /*const imagesTableActions: CreateDeleteEntityAction[] = document
      .reduce<TableEntity<ITableImage>[]>(
        (itemRows, item) => [
          ...itemRows,
          ...item.images.map<TableEntity<ITableImage>>((src) => {
            const name = (
              src.match(/[\d\w]+\/[\d\w_-]+.(jpe?g|png)$/g) as string[]
            )[0];
            return {
              partitionKey: item.vendor_code,
              rowKey: encodeURIComponent(name),
              url: src,
              name: name,
              document: fileName,
            };
          }),
        ],
        []
      )
      .map<CreateDeleteEntityAction>((tableEntity) => [
        "create",
        tableEntity as any,
      ]);

    const documentFieldTableActions: CreateDeleteEntityAction[] = dataFromPages
      .reduce<TableEntity<IFieldData>[]>((rows, row) => {
        const vendorCodeIndex = row.findIndex(
          (field) => field.name === "vendor_code"
        ) as number;
        const vendorCode = row[vendorCodeIndex].value as string;

        return [
          ...rows,
          ...row.map<TableEntity<IFieldData>>((field) => ({
            partitionKey: vendorCode,
            rowKey: field.name,
            name: field.name,
            value: field.value,
            document: fileName,
          })),
        ];
      }, [])
      .map<CreateDeleteEntityAction>((tableEntity) => [
        "create",
        tableEntity as any,
      ]);

    const documentSourceRelationTableActions: CreateDeleteEntityAction[] =
      dictionary
        .reduce<TableEntity<ITableDocumentSourceRelation>[]>(
          (rows, row) => [
            ...rows,
            {
              partitionKey: row.sourceName,
              rowKey: row.vendorCode,
              document: fileName,
            },
          ],
          []
        )
        .map<CreateDeleteEntityAction>((tableEntity) => [
          "create",
          tableEntity as any,
        ]);

    await Promise.all([
      this.imagesTableClient.submitTransaction(imagesTableActions),
      this.documentFieldTableClient.submitTransaction(
        documentFieldTableActions
      ),
      this.documentSourceRelationTableClient.submitTransaction(
        documentSourceRelationTableActions
      ),
    ]);*/
    //hoods-2022-06-27T22:55:33.868Z
  }
}
