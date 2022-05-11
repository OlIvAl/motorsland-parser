import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { IDocumentList } from "../../../domain/entity/List/stuctures/interfaces";
import { IDocument } from "../../../domain/entity/Document/structures/interfaces";
import { IAPIClient } from "../../../libs/API/interfaces";

export abstract class DocumentRepository implements IDocumentRepository {
  protected constructor(protected apiClient: IAPIClient) {}

  abstract getList(): Promise<IDocumentList>;
  abstract create(): Promise<IDocument>;
  abstract delete(id: ID): Promise<void>;
}
