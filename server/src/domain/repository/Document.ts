import { IDocument } from "../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../constants";
import { IItemData } from "../../dataSources/interfases";

export interface IDocumentRepository {
  getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]>;
  getDocument(name: string): Promise<IItemData[]>;
  create(uploading: UPLOADING_NAME): Promise<IDocument>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number>;
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
