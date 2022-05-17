import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { ID } from "../../../interfaces";

export interface IGetDocumentListUseCase {
  execute(): Promise<IDocumentList>;
}
export interface ICreateDocumentUseCase {
  execute(fields?: Record<string, string>): Promise<IDocument>;
}
export interface IDeleteDocumentUseCase {
  execute(id: ID): Promise<void>;
}
export interface IUpdateNewDocumentsCountUseCase {
  execute(): Promise<number>;
}
