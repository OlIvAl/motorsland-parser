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

  setProgress(process: boolean): void {
    this._list.progress = process;
  }

  setNewDocumentsCount(count: number): void {
    this._list.newDocumentsCount = count;
  }

  dispose(): void {
    this._list = new DocumentList();
  }
}
