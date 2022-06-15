import { IUploading } from "./interfaces";
import { makeAutoObservable } from "mobx";

export class Uploading implements IUploading {
  id = "";
  name = "";
  newDocumentsCount = 0;
  loading = false;

  constructor() {
    makeAutoObservable<IUploading>(this);
  }
}
