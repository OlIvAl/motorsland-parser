import { injected } from "brandi";
import {
  IDocumentDTO,
  IDocumentListDTO,
  IDocumentRepository,
} from "../../../domain/repository/Document/interfaces";
import { IAPIClient } from "../../../libs/API/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { DocumentRepository } from "./DocumentRepository";
import {
  DocumentListSchema,
  DocumentSchema,
} from "../../validationSchemas/Document";
import { DocumentList } from "../../../domain/entity/List/stuctures/DocumentList";
import { DATA_SOURCE_REMOTE } from "../../../Bootstrap/config/di/dataSource";

export class EngineRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  constructor(protected apiClient: IAPIClient) {
    super(apiClient);
  }

  async getList(): Promise<IDocumentList> {
    try {
      const resp = await this.apiClient.getData<void, IDocumentListDTO>(
        "engines"
      );

      const result = DocumentListSchema.cast(resp);

      return { ...new DocumentList(), ...result };
    } catch (e) {
      // ToDo: handle error;
      throw e;
    }
  }
  async create(): Promise<IDocument> {
    try {
      const resp = await this.apiClient.postData<void, IDocumentDTO>("engines");

      const result = DocumentSchema.cast(resp);

      return { ...new Document(), ...result };
    } catch (e) {
      // ToDo: handle error;
      throw e;
    }
  }
  async delete(id: ID): Promise<void> {
    try {
      await this.apiClient.deleteData<void, IDocumentDTO>(`engines/${id}`);
    } catch (e) {
      // ToDo: handle error;
      throw e;
    }
  }
}

injected(EngineRepository, DATA_SOURCE_REMOTE.APIClient);
