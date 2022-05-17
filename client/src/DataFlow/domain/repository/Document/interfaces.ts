import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";

export interface IDocumentRepository {
  getList(): Promise<IDocumentList>;
  create(): Promise<IDocument>;
  delete(id: ID): Promise<void>;
  updateNewItemsCount(): Promise<number>;
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
