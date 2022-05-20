import {
  IDocumentDTO,
  IDocumentListDTO,
} from "../../domain/repository/Document/interfaces";

export interface IDocumentAPIClient {
  getList(category: string): Promise<IDocumentListDTO>;
  create(category: string): Promise<IDocumentDTO>;
  delete(category: string, id: ID): Promise<void>;
  updateNewDocumentsCount(category: string): Promise<number>;
}
