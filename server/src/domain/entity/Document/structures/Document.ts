import { ID } from "../../../../interfaces";
import { IDocument } from "./interfaces";

export class Document implements IDocument {
  id: ID = "";
  name: string = "";
  createdOn: Date = new Date();
}
