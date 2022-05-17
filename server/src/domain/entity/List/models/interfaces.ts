import { IDocumentList, IList } from "../stuctures/interfaces";
import { IDocument } from "../../Document/structures/interfaces";
import { ID } from "../../../../interfaces";

export interface IListModel<M extends { id: ID }> {
  list: IList<M>;
  setList(list: IList<M>): void;
  setItems(items: M[]): void;
  setItem(item: M): void;
  updateItem(id: ID, item: M): void;
  removeItem(id: ID): void;
  dispose(): void;
}

export interface IDocumentListModel extends IListModel<IDocument> {
  list: IDocumentList;
  setList(list: IDocumentList): void;
  setProgress(process: boolean): void;
  setNewItemsCount(count: number): void;
}
