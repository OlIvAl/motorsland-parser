import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { CONTAINER_NAME } from "../../../constants";

export class EngineRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  protected storage = CONTAINER_NAME.ENGINES_CONTAINER_NAME;
}

injected(
  EngineRepository,
  DATA_SOURCE_REMOTE.EngineStorage,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.EngineListDocumentBuilder,
  DATA_SOURCE_REMOTE.ProgressTableClient,
  DATA_SOURCE_REMOTE.NewItemsCountTableClient
);
