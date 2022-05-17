import {
  IDocumentDTO,
  IDocumentListDTO,
  IDocumentRepository,
} from "../../../domain/repository/Document/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { IAPIClient } from "../../../dataSource/API/interfaces";
import {
  DocumentListSchema,
  DocumentSchema,
} from "../../validationSchemas/Document";
import { DocumentList } from "../../../domain/entity/List/stuctures/DocumentList";

export abstract class DocumentRepository implements IDocumentRepository {
  protected abstract root: string;

  constructor(protected apiClient: IAPIClient) {}

  async getList(): Promise<IDocumentList> {
    const resp = await this.apiClient.getData<void, IDocumentListDTO>(
      this.root
    );

    const result = DocumentListSchema.cast(resp);

    return { ...new DocumentList(), ...result };
  }
  async create(): Promise<IDocument> {
    const resp = await this.apiClient.postData<void, IDocumentDTO>(this.root);

    const result = DocumentSchema.cast(resp);

    return { ...new Document(), ...result };
  }
  async delete(id: ID): Promise<void> {
    await this.apiClient.deleteData<void, IDocumentDTO>(`${this.root}/${id}`);
  }
  async updateNewDocumentsCount(): Promise<number> {
    const resp = await this.apiClient.postData<void, { count: number }>(
      `${this.root}/items/new`
    );

    return resp.count;
  }
}
