import { IDocumentDTO } from "../../domain/repository/Document/interfaces";

export interface IDocumentListViewModel {
  list: IDocumentPresentationData[];
  newItemsCount: number;
  loadingList: boolean;
  loadingCount: boolean;
  createNewItemProcess: boolean;

  getList(): Promise<void>;
  createItem(): Promise<void>;
  deleteItem(id: ID): Promise<void>;
  updateNewItemsCount(): Promise<void>;
}

export interface IDocumentPresentationData extends IDocumentDTO {
  id: ID;
}
