import { Container, token } from "brandi";
import {
  IAzureBlobStorage,
  INewItemsCountTableClient,
  IProgressTableClient,
} from "../dataSources/interfases";
import { IDocumentBuilder } from "../dataSources/DocumentBuilder/interfaces";
import { AzureBlobStorage } from "../dataSources/AzureBlobStorage";
import { CONTAINER_NAME } from "../constants";
import { DocumentBuilder } from "../dataSources/DocumentBuilder/DocumentBuilder";
import { ProgressTableClient } from "../dataSources/ProcessTableClient";
import { NewItemsCountTableClient } from "../dataSources/NewItemsCountTableClient";

export const DATA_SOURCE_REMOTE = {
  EngineStorage: token<IAzureBlobStorage>("EngineStorage"),
  TransmissionStorage: token<IAzureBlobStorage>("TransmissionStorage"),
  ImageStorage: token<IAzureBlobStorage>("ImageStorage"),
  EngineListDocumentBuilder: token<IDocumentBuilder>(
    "EngineListDocumentBuilder"
  ),
  TransmissionListDocumentBuilder: token<IDocumentBuilder>(
    "TransmissionListDocumentBuilder"
  ),
  ProgressTableClient: token<IProgressTableClient>("ProgressTableClient"),
  NewItemsCountTableClient: token<INewItemsCountTableClient>(
    "NewItemsCountTableClient"
  ),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(container: Container): Container {
  container
    .bind(DATA_SOURCE_REMOTE.EngineStorage)
    .toConstant(new AzureBlobStorage(CONTAINER_NAME.ENGINES_CONTAINER_NAME));
  container
    .bind(DATA_SOURCE_REMOTE.TransmissionStorage)
    .toConstant(
      new AzureBlobStorage(CONTAINER_NAME.TRANSMISSIONS_CONTAINER_NAME)
    );
  container
    .bind(DATA_SOURCE_REMOTE.ImageStorage)
    .toConstant(new AzureBlobStorage(CONTAINER_NAME.IMAGES_CONTAINER_NAME));

  container
    .bind(DATA_SOURCE_REMOTE.EngineListDocumentBuilder)
    .toConstant(new DocumentBuilder("https://motorlandby.ru/engines/"));
  container
    .bind(DATA_SOURCE_REMOTE.TransmissionListDocumentBuilder)
    .toConstant(new DocumentBuilder("https://motorlandby.ru/transmission/"));

  container
    .bind(DATA_SOURCE_REMOTE.ProgressTableClient)
    .toConstant(new ProgressTableClient());
  container
    .bind(DATA_SOURCE_REMOTE.NewItemsCountTableClient)
    .toConstant(new NewItemsCountTableClient());

  return container;
}
