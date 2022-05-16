import { IDocumentListModel } from "./interfaces";
import { IDocumentList } from "../stuctures/interfaces";
import { ListModel } from "./ListModel";
import { IDocument } from "../../Document/structures/interfaces";
import { DocumentList } from "../stuctures/DocumentList";

export class DocumentListModel
  extends ListModel<IDocument>
  implements IDocumentListModel
{
  get list(): IDocumentList {
    return this._list;
  }
  constructor(protected _list: IDocumentList = new DocumentList()) {
    super(_list);
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
