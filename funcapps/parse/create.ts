/* documentBuilder;
ImageBuilder;
imagesStorage;
documentTableClient;

async function create(
  uploading: string,
  sources: any[],
  lastDocumentVC: string[]
): Promise<IDocument> {
  let docObj: IItemData[] = [];

  try {
    console.log("Начался процесс создания документа!");

    await documentBuilder.dispose();
    await documentBuilder.initBrowser();

    console.log("Браузер открыт!");

    await documentBuilder.setSources(sources);
    await documentBuilder.setVendorCodesListFromLastDocument(lastDocumentVC);
    // ToDo: RETURN!!!!
    // ToDo: повторяющиеся 2 раза действие
    /*if ((await documentBuilder.getNewLinksCount()) < 50) {
    // ToDo: update new links count!
    throw new BadRequest(ErrCodes.LESS_THAN_50_ITEMS);
  }*!/

    await documentBuilder.buildDocument();

    docObj = documentBuilder.getDocument();

    await documentBuilder.dispose();
    console.log("Браузер заткрыт!");

    for (let i = 0; i < docObj.length; i++) {
      docObj[i].images = await Promise.all(
        docObj[i].images.map(async (imgSrc: string) => {
          const imageBuilder = new ImageBuilder(imgSrc);
          const [fileName, buffer] = await imageBuilder.getBuffer();

          await imagesStorage.upload(buffer, fileName, "image/jpeg");

          return decodeURIComponent(imagesStorage.getURL(fileName));
        })
      );
      console.log(
        `(${i + 1} из ${
          docObj.length
        }) Закончена обработка картинок товара с артикулом ${
          docObj[i].vendor_code
        }`
      );
    }

    const date = new Date();

    const resp = await documentTableClient.addDocument(uploading, docObj);

    console.log(`Новая выгрузка ${resp.name} добавлена в БД!`);

    return {
      ...new Document(),
      ...{
        id: resp.name,
        name: resp.name,
        createdOn: date,
      },
    };
  } catch (e) {
    await documentBuilder.dispose();
    console.log("Произошла ошибка! Браузер заткрыт, если был открыт!");

    throw e;
  } finally {
    console.log("Процесс создания документа окончен!");
  }
} */
