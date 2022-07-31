import { IUploading } from "../entity/Uploading/structures/interfaces";

export interface IUploadingRepository {
  getList(): Promise<IUploading[]>;
}
