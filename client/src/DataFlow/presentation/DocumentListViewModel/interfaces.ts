import { IDocumentDTO } from "../../domain/repository/Document/interfaces";

export interface IDocumentListViewModel {
  list: IDocumentPresentationData[];
  newDocumentsCount: number;
  loadingList: boolean;
  loadingCount: boolean;
  createNewDocumentProcess: boolean;

  getList(): Promise<void>;
  createItem(): Promise<void>;
  deleteItem(id: ID): Promise<void>;
  updateNewDocumentsCount(): Promise<void>;
}

export interface IDocumentPresentationData extends IDocumentDTO {
  id: ID;
}
