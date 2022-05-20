import { Container, token } from "brandi";
import { DocumentListModel } from "../domain/entity/List/models/DocumentListModel";
import { IDocumentListModel } from "../domain/entity/List/models/interfaces";
import { IAPIClient } from "../dataSource/API/interfaces";
import { IDocumentAPIClient } from "../dataSource/DocumentAPIClient/interfaces";

export const BUSINESS_MODELS = {
  DocumentList: token<IDocumentListModel>("DocumentList"),
};

export const DATA_SOURCE_REMOTE = {
  APIClient: token<IAPIClient>("APIClient"),
  DocumentAPIClient: token<IDocumentAPIClient>("DocumentAPIClient"),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(container: Container): Container {
  container
    .bind(BUSINESS_MODELS.DocumentList)
    .toInstance(DocumentListModel)
    .inSingletonScope();

  return container;
}
