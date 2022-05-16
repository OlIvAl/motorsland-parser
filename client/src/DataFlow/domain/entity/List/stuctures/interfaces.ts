import { IDocument } from "../../Document/structures/interfaces";

export interface IList<M extends { id: ID }> {
  items: M[];
}

export interface IDocumentList extends IList<IDocument> {
  progress: boolean;
  newItemsCount: number;
}
