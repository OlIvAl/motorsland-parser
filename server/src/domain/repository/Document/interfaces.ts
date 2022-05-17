import { IDocument } from "../../entity/Document/structures/interfaces";
import { ID } from "../../../interfaces";

export interface IDocumentRepository {
  getDocuments(): Promise<IDocument[]>;
  getProgress(): Promise<boolean>;
  getNewDocumentsCount(): Promise<number>;
  updateNewDocumentsCount(): Promise<number>;
  create(fields: Record<string, string>): Promise<IDocument>;
  delete(id: ID): Promise<void>;
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
