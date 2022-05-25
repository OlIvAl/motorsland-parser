import { IDocument } from "../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../constants";
import { IItemData } from "../../dataSources/interfases";

export interface IDocumentRepository {
  getDocuments(uploading: UPLOADING_NAME): Promise<IDocument[]>;
  getDocumentWithPublicLink(name: string): Promise<IItemData[]>;
  create(uploading: UPLOADING_NAME): Promise<IDocument>;
  delete(uploading: UPLOADING_NAME, name: string): Promise<void>;
  updateNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number>;
  // upload(name: string): Promise<Buffer>;
}

export interface IDocumentDTO {
  name: string;
  createdOn: string;
  publicURL: string;
}
export interface IDocumentListDTO {
  items: IDocumentDTO[];
  progress: boolean;
  newDocumentsCount: number;
}
