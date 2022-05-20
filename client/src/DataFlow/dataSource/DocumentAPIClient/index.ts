import { IDocumentAPIClient } from "./interfaces";
import { IAPIClient } from "../API/interfaces";
import {
  IDocumentDTO,
  IDocumentListDTO,
} from "../../domain/repository/Document/interfaces";

export class DocumentAPIClient implements IDocumentAPIClient {
  constructor(protected apiClient: IAPIClient) {}

  async getList(category: string): Promise<IDocumentListDTO> {
    return await this.apiClient.getData<void, IDocumentListDTO>(category);
  }
  async create(category: string): Promise<IDocumentDTO> {
    return await this.apiClient.postData<void, IDocumentDTO>(category);
  }
  async delete(category: string, id: ID): Promise<void> {
    await this.apiClient.deleteData<void, IDocumentDTO>(`${category}/${id}`);
  }
  async updateNewDocumentsCount(category: string): Promise<number> {
    return (
      await this.apiClient.postData<void, { count: number }>(
        `${category}/items/new`
      )
    ).count;
  }
}
