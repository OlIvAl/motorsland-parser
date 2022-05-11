import { IDocument } from "./interfaces";
import { makeAutoObservable } from "mobx";

export class Document implements IDocument {
  id: ID = "";
  name: string = "";
  createdOn: Date = new Date();
  publicURL: string = "";

  constructor() {
    makeAutoObservable<IDocument>(this);
  }
}
