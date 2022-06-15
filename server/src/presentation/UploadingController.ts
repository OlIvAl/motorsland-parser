import { IUploadingController } from "./interfaces";
import { IGetUploadingListUseCase } from "../domain/usecase/Uploading/interfaces";
import { injected } from "brandi";
import { USE_CASE } from "../di/usecase";
import { IUploading } from "../domain/entity/Uploading/structures/interfaces";

export class UploadingController implements IUploadingController {
  constructor(private getUploadingListUseCase: IGetUploadingListUseCase) {}

  async getList(): Promise<IUploading[]> {
    const result = await this.getUploadingListUseCase.execute();

    return result.items;
  }
}

injected(UploadingController, USE_CASE.GetUploadingList);
