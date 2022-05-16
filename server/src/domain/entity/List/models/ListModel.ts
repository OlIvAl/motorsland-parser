import { IListModel } from "./interfaces";
import { List } from "../stuctures/List";
import { IList } from "../stuctures/interfaces";
import { ID } from "../../../../interfaces";

export class ListModel<M extends { id: ID }> implements IListModel<M> {
  get list(): IList<M> {
    return this._list;
  }

  constructor(protected _list: IList<M> = new List<M>()) {}

  setList(list: IList<M>): void {
    this._list = list;
  }
  setItems(items: M[] = []): void {
    this._list.items = items;
  }
  setItem(item: M): void {
    this._list.items = [item, ...this._list.items];
  }
  updateItem(id: ID, item: M): void {
    if (!this._list.items) {
      throw Error("List items do not initiated!");
    }
    if (!id) {
      return;
    }

    let i = this._list.items.findIndex((value) => value.id === id);

    if (i >= 0) {
      this._list.items[i] = item;
    }
  }
  removeItem(id: ID): void {
    if (!this._list.items) {
      throw Error("List items do not initiated!");
    }

    const i = this._list.items.findIndex((value) => value.id === id);

    if (i >= 0) {
      this._list.items.splice(i, 1);
    }
  }

  dispose(): void {
    this._list = new List<M>();
  }
}
