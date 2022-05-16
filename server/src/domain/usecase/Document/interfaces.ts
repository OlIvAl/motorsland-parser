import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { ID } from "../../../interfaces";

export interface IGetListUseCase {
  execute(): Promise<IDocumentList>;
}
export interface ICreateItemUseCase {
  execute(fields?: Record<string, string>): Promise<IDocument>;
}
export interface IDeleteItemUseCase {
  execute(id: ID): Promise<void>;
}
