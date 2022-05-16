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
  protected constructor(protected apiClient: IAPIClient) {}

  abstract getList(): Promise<IDocumentList>;
  abstract create(): Promise<IDocument>;
  abstract delete(id: ID): Promise<void>;

  protected getRequestedList(resp: IDocumentListDTO): IDocumentList {
    const result = DocumentListSchema.cast(resp);

    return { ...new DocumentList(), ...result };
  }

  protected getCreatedList(resp: IDocumentDTO): IDocument {
    const result = DocumentSchema.cast(resp);

    return { ...new Document(), ...result };
  }
}
