import { IDocumentDTO } from "../../domain/repository/Document/interfaces";

export interface IDocumentListViewModel {
  list: IDocumentPresentationData[];
  newItemsCount: number;
  loadingList: boolean;
  createNewItemProcess: boolean;

  getList(): Promise<void>;
  createItem(): Promise<void>;
  deleteItem(id: ID): Promise<void>;
}

export interface IDocumentPresentationData extends IDocumentDTO {
  id: ID;
}
