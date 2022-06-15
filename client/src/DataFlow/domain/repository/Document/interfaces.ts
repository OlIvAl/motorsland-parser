import { IDocumentList, IList } from "../../entity/List/stuctures/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { IUploading } from "../../entity/Uploading/structures/interfaces";

export interface IUploadingRepository {
  getList(): Promise<IUploading[]>;
}

export interface IDocumentRepository {
  getList(uploading: string): Promise<IDocumentList>;
  create(uploading: string): Promise<IDocument>;
  delete(uploading: string, id: ID): Promise<void>;
  updateNewDocumentsCount(uploading: string): Promise<number>;
}

export interface IDocumentDTO {
  name: string;
  createdOn: string;
}
export interface IDocumentListDTO {
  items: IDocumentDTO[];
  progress: boolean;
  newItemsCount: number;
}
