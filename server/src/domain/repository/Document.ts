import { IDocument } from "../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../constants";
import { Transform, Writable } from "stream";

export interface IDocumentRepository {
  getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]>;
  getDocument(
    name: string,
    formatter: Transform,
    writable: Writable
  ): Promise<Writable>;
  create(uploading: UPLOADING_NAME): Promise<IDocument>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  getHeaders(): Promise<Record<string, string>>;
}

export interface IDocumentDTO {
  name: string;
  createdOn: string;
}
export interface IDocumentListDTO {
  items: IDocumentDTO[];
  progress: boolean;
  newDocumentsCount: number;
}
