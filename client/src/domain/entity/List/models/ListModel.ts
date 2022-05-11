import { action, computed, makeObservable, observable } from "mobx";
import { IListModel } from "./interfaces";
import { List } from "../stuctures/List";
import { IList } from "../stuctures/interfaces";

export class ListModel<M extends { id: ID }> implements IListModel<M> {
  get list(): IList<M> {
    return this._list;
  }

  constructor(protected _list: IList<M> = new List<M>()) {
    makeObservable<IListModel<M>, "_list">(this, {
      list: computed,
      _list: observable,
      setList: action.bound,
      setItems: action.bound,
      updateItem: action.bound,
      removeItem: action.bound,
      dispose: action.bound,
    });
  }

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
