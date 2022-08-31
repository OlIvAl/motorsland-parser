import {
  AzureNamedKeyCredential,
  odata,
  TableClient,
  TableEntityResult,
} from "@azure/data-tables";
import { CONTAINER_NAME, UPLOADING_NAME } from "../constants";
import {
  IDataRow,
  IDocumentInfo,
  IDocumentTableClient,
  IFieldData,
  IItemData,
  IItemSourceDictionary,
  ITableImage,
  ITableSource,
} from "./interfases";
import { Conveyor } from "../libs/Conveyor";
import { getLocalTime } from "../libs/getLocalTime";
import { AzureBlobStorage } from "./AzureBlobStorage";
import { BrowserFacade } from "./scrapers/BrowserFacade";
import { DataScraper } from "./scrapers/DataScraper";

export class DocumentTableClient implements IDocumentTableClient {
  private documentTableClient: TableClient;
  private dataTableClient: TableClient;
  private imagesTableClient: TableClient;
  private sourceTableClient: TableClient;

  constructor() {
    const credential = new AzureNamedKeyCredential(
      process.env.AZURE_ACCOUNT as string,
      process.env.AZURE_ACCOUNT_KEY as string
    );

    this.documentTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "document",
      credential
    );
    this.dataTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "data",
      credential
    );
    this.imagesTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "images",
      credential
    );
    this.sourceTableClient = new TableClient(
      `https://${process.env.AZURE_ACCOUNT}.table.core.windows.net`,
      "source",
      credential
    );
  }

  async getSources(): Promise<
    Record<
      string,
      Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
    >
  > {
    const sources = await this.sourceTableClient.listEntities<ITableSource>();

    let sourcesRecord: Record<
      string,
      Pick<ITableSource, "preVendorCode" | "markup" | "exchangeRate">
    > = {};

    for await (const source of sources) {
      sourcesRecord = {
        ...sourcesRecord,
        ...{
          [source.rowKey as string]: {
            preVendorCode: source.preVendorCode as string,
            markup: source.markup,
            exchangeRate: source.exchangeRate,
          },
        },
      };
    }

    return sourcesRecord;
  }

  async *getDataRows(name: string): AsyncIterable<IDataRow> {
    const dataRows = await this.dataTableClient.listEntities<
      TableEntityResult<IDataRow>
    >({
      queryOptions: {
        filter: odata`source eq 'autopriwos.ru'`,
        // filter: odata`PartitionKey eq ${name}`,
      },
    });

    for await (let dataRow of dataRows) {
      const { partitionKey, rowKey, etag, timestamp, ...data } = dataRow;

      yield data;
    }
  }
  async getImgSrcArr(vendorCode: string): Promise<string[]> {
    const imageRows = await this.imagesTableClient.listEntities<ITableImage>({
      queryOptions: { filter: odata`PartitionKey eq ${vendorCode}` },
    });

    let images: string[] = [];

    for await (const item of imageRows) {
      images.push(item.name);
    }

    return images;
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
    return Promise.resolve();
  }

  async migrate(): Promise<void> {
    const uploading: any = {
      category: "fenders",
      index: 1,
      document: "fenders-2022-07-13T17:19:21.441Z",
    };
    const tempStorage = new AzureBlobStorage(
      CONTAINER_NAME.TEMP_CONTAINER_NAME
    );

    const motorlandLinks: string[] = JSON.parse(
      (
        await tempStorage.getBuffer(`${uploading.category}_new_links.json`)
      ).toString()
    )[uploading.index];

    console.log(`Взято ${motorlandLinks.length} ссылок`);

    const browser = new BrowserFacade();
    await browser.init();

    const conveyor = new Conveyor<
      string,
      { vendor_code?: string; year?: string }
    >(motorlandLinks, 33, async (link) => {
      const page = await browser.openNewPage();

      await page.goto(link, {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      const [year, vendorCode] = await Promise.all([
        DataScraper.getFieldBySelector(page, {
          field: "year",
          xpaths: [
            '//table[@id="_part_details_table"]//td[contains(., "Год:")]/following-sibling::td/text()',
          ],
        }),
        DataScraper.getFieldBySelector(page, {
          field: "vendor_code",
          xpaths: [
            '//table[@id="_part_details_table"]//td[contains(., "Артикул:")]/following-sibling::td/text()',
          ],
        }),
      ]);

      await BrowserFacade.closePage(page);

      if (!vendorCode.vendor_code) {
        console.log("Failed link =>", link);
      } else {
        console.log({
          ...vendorCode,
          ...year,
        });
      }

      if (!vendorCode.vendor_code) {
        return {
          vendor_code: undefined,
          year: undefined,
        };
      }

      return {
        ...vendorCode,
        ...year,
      };
    });

    conveyor.setStartHandleTime(false);
    const arr = await conveyor.handle();

    await browser.dispose();

    const updateConveyor = new Conveyor<
      { vendor_code?: string; year?: string },
      void
    >(arr, 100, async (obj) => {
      if (!obj.vendor_code || !obj.year) {
        return undefined;
      }

      try {
        await this.dataTableClient.updateEntity<Partial<any>>(
          {
            partitionKey: uploading.document,
            rowKey: obj.vendor_code,
            year: obj.year,
            left_right: "правая",
            front_rear: "передняя",
          },
          "Merge"
        );
      } catch (e) {
        console.log("Error => ", obj.vendor_code);
      }
    });

    updateConveyor.setStartHandleTime(false);
    await updateConveyor.handle();
    /*async function* getDataRows(
      dataTableClient: TableClient
    ): AsyncIterable<TableEntity<IDataRow>> {
      const dataRows = await dataTableClient.listEntities<
        TableEntityResult<IDataRow>
      >();

      for await (let dataRow of dataRows) {
        const { timestamp, etag, ...data } = dataRow;
        yield data as TableEntity<IDataRow>;
      }
    }

    class TableTransform extends Transform {
      #buffer: TableEntity<IDataRow>[] = [];

      constructor(private dataTableClient: TableClient) {
        super({ objectMode: true });
      }

      _transform(
        chunk: TableEntity<IDataRow>,
        encoding: BufferEncoding,
        done: TransformCallback
      ) {
        this.#buffer.push(chunk);

        if (this.#buffer.length < 50) {
          done();
        } else {
          this.#transformFn().then(() => done());
        }
      }

      _flush(done: TransformCallback) {
        if (this.#buffer.length > 0) {
          this.#transformFn().then(() => done());
        } else {
          done();
        }
      }

      #transformFn(): Promise<any> {
        return Promise.all(
          this.#buffer.map(async (row) => {
            console.log("Handled:", row.vendor_code);
            await this.dataTableClient.updateEntity(
              {
                ...row,
                uploading: undefined,
                source: row.source,
              },
              "Replace"
            );

            return Promise.resolve(true);
          })
        ).then(() => {
          this.#buffer.forEach((item) => {
            this.push(item);
          });

          this.#buffer = [];
        });
      }
    }

    console.log(getLocalTime(), `Start handling`);
    const dataGenerator = await getDataRows(this.dataTableClient);

    await pipeline(
      Readable.from(dataGenerator, {
        objectMode: true,
      }),
      new TableTransform(this.dataTableClient),
      new Writable({
        write(
          chunk: any,
          encoding: BufferEncoding,
          callback: (error?: Error | null) => void
        ) {
          callback();
        },
        objectMode: true,
      })
    );
    console.log(getLocalTime(), `Finish handling`); */
    /*const sources = await this.getSources();
    const documents = [
      "trunk_lids-2022-07-13T22:32:28.686Z",
      "backlamps-2022-07-13T21:06:29.329Z",
      "bumpers-2022-07-14T10:15:57.197Z",
      "doors-2022-07-13T10:56:53.196Z",
      "engines-2022-07-05T05:53:25.079Z",
      "fenders-2022-07-13T17:19:21.441Z",
      "headlamps-2022-07-09T07:48:50.055Z",
      "hoods-2022-07-13T15:04:29.466Z",
      "mirrors-2022-07-13T06:36:12.988Z",
      "transmissions-2022-07-06T04:16:25.594Z",
    ];

    for (let document of documents) {
      console.log(getLocalTime(), `Start handle ${document}`);

      const dataGenerator = await this.getDataRows(document);

      await pipeline(
        Readable.from(dataGenerator, {
          objectMode: true,
        }),
        new AddImagesTransform(this, this.imagesStorage),
        new PostProcessingTransform(sources),
        fs.createWriteStream(EXAMPLE_FILE)
      );
    }

    console.log(getLocalTime(), `Finish handling!!!`);*/
    /*const documents = [
      "trunk_lids-2022-07-13T22:32:28.686Z",
      "backlamps-2022-07-13T21:06:29.329Z",
      "bumpers-2022-07-14T10:15:57.197Z",
      "doors-2022-07-13T10:56:53.196Z",
      "engines-2022-07-05T05:53:25.079Z",
      "fenders-2022-07-13T17:19:21.441Z",
      "headlamps-2022-07-09T07:48:50.055Z",
      "hoods-2022-07-13T15:04:29.466Z",
      "mirrors-2022-07-13T06:36:12.988Z",
      "transmissions-2022-07-06T04:16:25.594Z",
    ];

    for (let document of documents) {
      console.log(getLocalTime(), `Start handle ${document}`);

      await pipeline(
        Readable.from(this.getDictionary(document), {
          objectMode: true,
          // @ts-ignore
        }).map(
          (dictionary: IDocumentSourceRelation) =>
            this.getDocumentField(dictionary),
          { concurrency: 1000 }
        ),
        new Writable({
          objectMode: true,
          write: (
            chunk: IItemData & { uploading: string; document: string },
            enc,
            done
          ) => {
            const { document, ...data } = chunk;
            this.dataTableClient
              .createEntity({
                partitionKey: document,
                rowKey: data.vendor_code,
                ...data,
              })
              .then(() => done());
          },
        })
      );
    }

    console.log(getLocalTime(), `Finish handling!!!`);

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
