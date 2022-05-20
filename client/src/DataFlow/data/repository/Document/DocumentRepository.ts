import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import {
  DocumentListSchema,
  DocumentSchema,
} from "../../validationSchemas/Document";
import { DocumentList } from "../../../domain/entity/List/stuctures/DocumentList";
import { IDocumentAPIClient } from "../../../dataSource/DocumentAPIClient/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../config/dataSource";

export class DocumentRepository implements IDocumentRepository {
  constructor(protected apiClient: IDocumentAPIClient) {}

  async getList(category: string): Promise<IDocumentList> {
    const resp = await this.apiClient.getList(category);

    const result = DocumentListSchema.cast(resp);

    return { ...new DocumentList(), ...result };
  }
  async create(category: string): Promise<IDocument> {
    const resp = await this.apiClient.create(category);

    const result = DocumentSchema.cast(resp);

    return { ...new Document(), ...result };
  }
  async delete(category: string, id: ID): Promise<void> {
    await this.apiClient.delete(category, id);
  }
  async updateNewDocumentsCount(category: string): Promise<number> {
    return await this.apiClient.updateNewDocumentsCount(category);
  }
}

injected(DocumentRepository, DATA_SOURCE_REMOTE.DocumentAPIClient);
