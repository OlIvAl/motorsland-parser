import { Container, token } from "brandi";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IUploadingTableClient,
} from "../dataSources/interfases";
import { AzureBlobStorage } from "../dataSources/AzureBlobStorage";
import { CONTAINER_NAME } from "../constants";
import { UploadingTableClient } from "../dataSources/UploadingTableClient";
import { DocumentTableClient } from "../dataSources/DocumentTableClient";
import { LinkListScraper } from "../dataSources/scrapers/LinkListScraper";
import { BrowserFacade } from "../dataSources/scrapers/BrowserFacade";

export const DATA_SOURCE_REMOTE = {
  ImageStorage: token<IAzureBlobStorage>("ImageStorage"),
  TempStorage: token<IAzureBlobStorage>("TempStorage"),
  LinkListScraper: token<LinkListScraper>("LinkListScraper"),
  UploadingTableClient: token<IUploadingTableClient>("UploadingTableClient"),
  DocumentTableClient: token<IDocumentTableClient>("DocumentTableClient"),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(container: Container): Container {
  const tediousConnectionConfig = {
    server: process.env.SQL_SERVER,
    authentication: {
      type: "default",
      options: {
        userName: process.env.SQL_SERVER_LOGIN,
        password: process.env.SQL_SERVER_PASSWORD,
      },
    },
    options: {
      port: 1433,
      database: process.env.SQL_DB,
      trustServerCertificate: true,
    },
  };

  const imagesStorage = new AzureBlobStorage(
    CONTAINER_NAME.IMAGES_CONTAINER_NAME
  );
  const tempStorage = new AzureBlobStorage(CONTAINER_NAME.TEMP_CONTAINER_NAME);

  container.bind(DATA_SOURCE_REMOTE.ImageStorage).toConstant(imagesStorage);
  container.bind(DATA_SOURCE_REMOTE.TempStorage).toConstant(tempStorage);

  container
    .bind(DATA_SOURCE_REMOTE.LinkListScraper)
    .toConstant(new LinkListScraper(new BrowserFacade()));

  container
    .bind(DATA_SOURCE_REMOTE.UploadingTableClient)
    .toConstant(new UploadingTableClient());

  container
    .bind(DATA_SOURCE_REMOTE.DocumentTableClient)
    .toConstant(new DocumentTableClient());

  return container;
}
