import { IDocumentDTO } from "../../domain/repository/Document/interfaces";

export interface IDocumentListViewModel {
  list: IDocumentPresentationData[];
  newDocumentsCount: number;
  loadingList: boolean;
  loadingCount: boolean;
  deletedItemId?: ID;
  createNewDocumentProcess: boolean;

  getList(category: string): Promise<void>;
  createItem(category: string): Promise<void>;
  deleteItem(id: ID, category: string): Promise<void>;
  updateNewDocumentsCount(category: string): Promise<void>;
}

export interface IDocumentPresentationData extends IDocumentDTO {
  id: ID;
}
