import { IList } from "./interfaces";
import { makeObservable, observable } from "mobx";

export class List<M extends { id: ID }> implements IList<M> {
  items: M[] = [];

  constructor() {
    makeObservable<IList<M>>(this, { items: observable });
  }
}
