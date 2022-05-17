import {
  IDocumentDTO,
  IDocumentListDTO,
} from "../domain/repository/Document/interfaces";
import { ID } from "../interfaces";

export interface IDocumentController {
  getList(): Promise<IDocumentListDTO>;
  create(): Promise<IDocumentDTO>;
  delete(id: ID): Promise<void>;
  updateNewDocumentsCount(): Promise<number>;
}
