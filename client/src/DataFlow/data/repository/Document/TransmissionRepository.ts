import { DocumentRepository } from "./DocumentRepository";
import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../config/dataSource";

export class TransmissionRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  protected root = "transmissions";
}

injected(TransmissionRepository, DATA_SOURCE_REMOTE.APIClient);
