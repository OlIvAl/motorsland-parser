import { IDocumentDTO, IDocumentListDTO } from "../domain/repository/Document";
import { UPLOADING_NAME } from "../constants";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";
import { Writable } from "stream";

export interface IDocumentController {
  getList(uploading: UPLOADING_NAME): Promise<IDocumentListDTO>;
  getXMLDocument(name: string): Promise<string>;
  getCSVDocument(name: string, res: any): Promise<Writable>;
  create(uploading: UPLOADING_NAME): Promise<IDocumentDTO>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
}
export interface IUploadingController {
  getList(): Promise<IUploading[]>;
}
