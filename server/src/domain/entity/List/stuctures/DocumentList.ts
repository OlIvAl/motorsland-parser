import { IDocumentList } from "./interfaces";
import { List } from "./List";
import { IDocument } from "../../Document/structures/interfaces";

export class DocumentList extends List<IDocument> implements IDocumentList {
  progress = false;
  newDocumentsCount = 0;
}
