import { injected } from "brandi";
import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import { DATA_SOURCE_REMOTE } from "../../../config/dataSource";

export class EngineRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  protected root = "engines";
}

injected(EngineRepository, DATA_SOURCE_REMOTE.APIClient);
