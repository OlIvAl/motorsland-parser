import { IDocumentDTO, IDocumentListDTO } from "../domain/repository/Document";
import { UPLOADING_NAME } from "../constants";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

export interface IDocumentController {
  getList(uploading: UPLOADING_NAME): Promise<IDocumentListDTO>;
  getXMLDocument(name: string): Promise<string>;
  getCSVDocument(name: string): Promise<string>;
  create(uploading: UPLOADING_NAME): Promise<IDocumentDTO>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number>;
}
export interface IUploadingController {
  getList(): Promise<IUploading[]>;
}
