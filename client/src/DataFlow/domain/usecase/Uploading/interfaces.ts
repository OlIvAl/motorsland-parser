import { IListModel } from "../../entity/List/models/interfaces";
import { IUploading } from "../../entity/Uploading/structures/interfaces";

export interface IGetUploadingListUseCase {
  execute(): Promise<IListModel<IUploading>>;
}
