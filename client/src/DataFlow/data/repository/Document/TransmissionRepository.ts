import { DocumentRepository } from "./DocumentRepository";
import {
  IDocumentDTO,
  IDocumentListDTO,
  IDocumentRepository,
} from "../../../domain/repository/Document/interfaces";
import { IAPIClient } from "../../../dataSource/API/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../../Bootstrap/config/di/dataSource";

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

      return this.getRequestedList(resp);
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

      return this.getCreatedList(resp);
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
