import { DocumentRepository } from "./DocumentRepository";
import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { inject, injectable } from "tsyringe";
import { DATA_SOURCE_REMOTE } from "../../../Bootstrap/config/di/dataSource";
import { IAPIClient } from "../../../libs/API/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { Document } from "../../../domain/entity/Document/structures/Document";
import { DocumentList } from "../../../domain/entity/List/stuctures/DocumentList";

@injectable()
export class TransmissionRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  constructor(
    @inject(DATA_SOURCE_REMOTE.APIClient) protected apiClient: IAPIClient
  ) {
    super(apiClient);
  }

  async getList(): Promise<IDocumentList> {
    return Promise.resolve(new DocumentList());
  }
  async create(): Promise<IDocument> {
    return Promise.resolve(new Document());
  }
  async delete(id: ID): Promise<void> {
    return Promise.resolve();
  }
}
