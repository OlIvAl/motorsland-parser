import { IDocumentListModel } from "./interfaces";
import { IDocumentList, IList } from "../stuctures/interfaces";
import { ListModel } from "./ListModel";
import { IDocument } from "../../Document/structures/interfaces";
import { DocumentList } from "../stuctures/DocumentList";
import { action, makeObservable } from "mobx";

export class DocumentListModel
  extends ListModel<IDocument>
  implements IDocumentListModel
{
  get list(): IDocumentList {
    return this._list;
  }
  constructor(protected _list: IDocumentList = new DocumentList()) {
    super(_list);

    makeObservable(this, {
      setProgress: action.bound,
      unsetProgress: action.bound,
      setNewItemsCount: action.bound,
    });
  }

  setProgress() {
    this._list.progress = true;
  }

  unsetProgress() {
    this._list.progress = false;
  }

  setNewItemsCount(count: number): void {
    this._list.newItemsCount = count;
  }

  dispose(): void {
    this._list = new DocumentList();
  }
}
