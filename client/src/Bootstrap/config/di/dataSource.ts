import { Container, token } from "brandi";
import { DocumentListModel } from "../../../DataFlow/domain/entity/List/models/DocumentListModel";
import { IDocumentListModel } from "../../../DataFlow/domain/entity/List/models/interfaces";
import { IAPIClient } from "../../../DataFlow/dataSource/API/interfaces";

export const BUSINESS_MODELS = {
  EngineList: token<IDocumentListModel>("EngineList"),
  TransmissionList: token<IDocumentListModel>("TransmissionList"),
};

export const DATA_SOURCE_REMOTE = {
  APIClient: token<IAPIClient>("APIClient"),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(container: Container): Container {
  container
    .bind(BUSINESS_MODELS.EngineList)
    .toInstance(DocumentListModel)
    .inSingletonScope();
  container
    .bind(BUSINESS_MODELS.TransmissionList)
    .toInstance(DocumentListModel)
    .inSingletonScope();

  return container;
}
