import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import { IAzureBlobStorage } from "../../../dataSources/interfases";
import { IDocumentBuilder } from "../../../dataSources/DocumentBuilder/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { EngineRepository } from "./EngineRepository";

export class TransmissionRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  constructor(
    // protected dbClient: IDBClient,
    protected documentsStorage: IAzureBlobStorage,
    protected imagesStorage: IAzureBlobStorage,
    protected documentsBuilder: IDocumentBuilder
  ) {
    super(
      // dbClient,
      documentsStorage,
      imagesStorage,
      documentsBuilder
    );
  }
}

injected(
  TransmissionRepository,
  DATA_SOURCE_REMOTE.TransmissionStorage,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.TransmissionListDocumentBuilder
);
