import { IDocumentListModel } from "../../entity/List/models/interfaces";

export interface IGetListUseCase {
  execute(): Promise<IDocumentListModel>;
}
export interface ICreateItemUseCase {
  execute(model: IDocumentListModel): Promise<IDocumentListModel>;
}
export interface IDeleteItemUseCase {
  execute(id: ID, model: IDocumentListModel): Promise<IDocumentListModel>;
}
export interface IUpdateNewDocumentsCountUseCase {
  execute(model: IDocumentListModel): Promise<IDocumentListModel>;
}
