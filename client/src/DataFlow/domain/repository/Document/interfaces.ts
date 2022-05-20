import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";

export interface IDocumentRepository {
  getList(category: string): Promise<IDocumentList>;
  create(category: string): Promise<IDocument>;
  delete(category: string, id: ID): Promise<void>;
  updateNewDocumentsCount(category: string): Promise<number>;
}

export interface IDocumentDTO {
  name: string;
  createdOn: string;
  publicURL: string;
}
export interface IDocumentListDTO {
  items: IDocumentDTO[];
  progress: boolean;
  newItemsCount: number;
}
