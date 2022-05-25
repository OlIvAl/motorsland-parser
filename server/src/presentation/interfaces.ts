import { IDocumentDTO, IDocumentListDTO } from "../domain/repository/Document";
import { ID } from "../interfaces";
import { UPLOADING_NAME } from "../constants";

export interface IDocumentController {
  getList(uploading: UPLOADING_NAME): Promise<IDocumentListDTO>;
  getXMLDocument(name: string): Promise<string>;
  create(uploading: UPLOADING_NAME): Promise<IDocumentDTO>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number>;
}
