import { DocumentRepository } from "./DocumentRepository";
import {
  IDocumentDTO,
  IDocumentListDTO,
  IDocumentRepository,
} from "../../../domain/repository/Document/interfaces";
import { IAPIClient } from "../../../libs/API/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { Document } from "../../../domain/entity/Document/structures/Document";
import { DocumentList } from "../../../domain/entity/List/stuctures/DocumentList";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../Bootstrap/config/di/dataSource";
import {
  DocumentListSchema,
  DocumentSchema,
} from "../../validationSchemas/Document";

export class TransmissionRepository
  extends DocumentRepository
  implements IDocumentRepository
{
  constructor(protected apiClient: IAPIClient) {
    super(apiClient);
  }

  async getList(): Promise<IDocumentList> {
    try {
      const resp = await this.apiClient.getData<void, IDocumentListDTO>(
        "transmissions"
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
      const resp = await this.apiClient.postData<void, IDocumentDTO>(
        "transmissions"
      );

      const result = DocumentSchema.cast(resp);

      return { ...new Document(), ...result };
    } catch (e) {
      // ToDo: handle error;
      throw e;
    }
  }
  async delete(id: ID): Promise<void> {
    try {
      await this.apiClient.deleteData<void, IDocumentDTO>(
        `transmissions/${id}`
      );
    } catch (e) {
      // ToDo: handle error;
      throw e;
    }
  }
}

injected(TransmissionRepository, DATA_SOURCE_REMOTE.APIClient);
