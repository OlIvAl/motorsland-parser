import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { ID } from "../../../interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { IItemData } from "../../../dataSources/interfases";

export interface IGetDocumentListUseCase {
  execute(uploading: UPLOADING_NAME): Promise<IDocumentList>;
}
export interface IGetDocumentUseCase {
  execute(name: string): Promise<IItemData[]>;
}
export interface ICreateDocumentUseCase {
  execute(uploading: UPLOADING_NAME): Promise<IDocument>;
}
export interface IDeleteDocumentUseCase {
  execute(uploading: UPLOADING_NAME, name: string): Promise<void>;
}
export interface IUpdateNewDocumentsCountUseCase {
  execute(uploading: UPLOADING_NAME): Promise<number>;
}
