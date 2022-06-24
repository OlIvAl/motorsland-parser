import { Container, token } from "brandi";
import {
  IAzureBlobStorage,
  IDocumentTableClient,
  IUploadingTableClient,
} from "../dataSources/interfases";
import { IDocumentBuilder } from "../dataSources/scrapers/interfaces";
import { AzureBlobStorage } from "../dataSources/AzureBlobStorage";
import { CONTAINER_NAME } from "../constants";
import { DocumentBuilder } from "../dataSources/scrapers/DocumentBuilder";
import { UploadingTableClient } from "../dataSources/UploadingTableClient";
import { DocumentTableClient } from "../dataSources/DocumentTableClient";

export const DATA_SOURCE_REMOTE = {
  ImageStorage: token<IAzureBlobStorage>("ImageStorage"),
  TempStorage: token<IAzureBlobStorage>("TempStorage"),
  DocumentBuilder: token<IDocumentBuilder>("DocumentBuilder"),
  UploadingTableClient: token<IUploadingTableClient>("UploadingTableClient"),
  DocumentTableClient: token<IDocumentTableClient>("DocumentTableClient"),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(container: Container): Container {
  const imagesStorage = new AzureBlobStorage(
    CONTAINER_NAME.IMAGES_CONTAINER_NAME
  );
  const tempStorage = new AzureBlobStorage(CONTAINER_NAME.TEMP_CONTAINER_NAME);

  container.bind(DATA_SOURCE_REMOTE.ImageStorage).toConstant(imagesStorage);
  container.bind(DATA_SOURCE_REMOTE.TempStorage).toConstant(tempStorage);

  container
    .bind(DATA_SOURCE_REMOTE.DocumentBuilder)
    .toConstant(new DocumentBuilder());

  container
    .bind(DATA_SOURCE_REMOTE.UploadingTableClient)
    .toConstant(new UploadingTableClient());

  container
    .bind(DATA_SOURCE_REMOTE.DocumentTableClient)
    .toConstant(new DocumentTableClient(imagesStorage));

  return container;
}
