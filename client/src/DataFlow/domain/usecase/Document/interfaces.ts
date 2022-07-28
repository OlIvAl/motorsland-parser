import { IDocumentListModel } from "../../entity/List/models/interfaces";

export interface IGetListUseCase {
  execute(category: string): Promise<IDocumentListModel>;
}
export interface ICreateItemUseCase {
  execute(
    model: IDocumentListModel,
    category: string
  ): Promise<IDocumentListModel>;
}
export interface IDeleteItemUseCase {
  execute(
    model: IDocumentListModel,
    id: ID,
    category: string
  ): Promise<IDocumentListModel>;
}
