import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import { IAzureBlobStorage } from "../../../dataSources/interfases";
import { IDocumentBuilder } from "../../../dataSources/DocumentBuilder/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";

export class EngineRepository
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
  EngineRepository,
  DATA_SOURCE_REMOTE.EngineStorage,
  DATA_SOURCE_REMOTE.ImageStorage,
  DATA_SOURCE_REMOTE.EngineListDocumentBuilder
);
