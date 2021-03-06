import { IDocumentList } from "./interfaces";
import { List } from "./List";
import { IDocument } from "../../Document/structures/interfaces";
import { makeObservable, observable } from "mobx";

export class DocumentList extends List<IDocument> implements IDocumentList {
  progress = false;
  newDocumentsCount = 0;

  constructor() {
    super();
    makeObservable<IDocumentList>(this, {
      progress: observable,
      newDocumentsCount: observable,
    });
  }
}
