import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { CONTAINER_NAME } from "../../../constants";

export class TransmissionRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  protected storage = CONTAINER_NAME.TRANSMISSIONS_CONTAINER_NAME;
}

injected(
  TransmissionRepository,
  DATA_SOURCE_REMOTE.TransmissionStorage,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.TransmissionListDocumentBuilder,
  DATA_SOURCE_REMOTE.ProgressTableClient,
  DATA_SOURCE_REMOTE.NewDocumentsCountTableClient
);
