import { DependencyContainer } from "tsyringe";
import { DocumentListModel } from "../../../domain/entity/List/models/DocumentListModel";
import { IDocumentListModel } from "../../../domain/entity/List/models/interfaces";

export const DATA_SOURCE_LOCAL = {
  EngineList: Symbol.for("EngineList"),
  TransmissionList: Symbol.for("TransmissionList"),
};

export const DATA_SOURCE_REMOTE = {
  APIClient: Symbol.for("APIClient"),
};

/**
 * Return container with data source child container
 */
export function getContainerWithDataSource(
  container: DependencyContainer
): DependencyContainer {
  container.registerInstance<IDocumentListModel>(
    DATA_SOURCE_LOCAL.EngineList,
    new DocumentListModel()
  );
  container.registerInstance<IDocumentListModel>(
    DATA_SOURCE_LOCAL.TransmissionList,
    new DocumentListModel()
  );

  return container;
}
