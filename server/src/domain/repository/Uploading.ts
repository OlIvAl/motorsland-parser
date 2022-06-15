import { IUploading } from "../entity/Uploading/structures/interfaces";

export interface IUploadingRepository {
  getList(): Promise<IUploading[]>;
  getUploadingProgress(uploading: string): Promise<boolean>;
  getCommonUploadingProgress(uploading: string): Promise<boolean>;
  getNewDocumentsCount(uploading: string): Promise<number>;
}
