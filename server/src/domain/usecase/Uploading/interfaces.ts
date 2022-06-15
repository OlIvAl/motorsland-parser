import { IList } from "../../entity/List/stuctures/interfaces";
import { IUploading } from "../../entity/Uploading/structures/interfaces";

export interface IGetUploadingListUseCase {
  execute(): Promise<IList<IUploading>>;
}
