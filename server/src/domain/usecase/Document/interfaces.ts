import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { Transform, Writable } from "stream";

export interface IGetDocumentListUseCase {
  execute(uploading: UPLOADING_NAME): Promise<IDocumentList>;
}
export interface IGetDocumentUseCase {
  execute(name: string): Promise<Writable>;
}
export interface ICreateDocumentUseCase {
  execute(uploading: UPLOADING_NAME): Promise<IDocument>;
}
export interface IDeleteDocumentUseCase {
  execute(uploading: UPLOADING_NAME, name: string): Promise<void>;
}
export interface IGetDocumentHeadersUseCase {
  execute(): Promise<Record<string, string>>;
}
