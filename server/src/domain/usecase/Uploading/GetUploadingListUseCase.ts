import { ListModel } from "../../entity/List/models/ListModel";
import { IList } from "../../entity/List/stuctures/interfaces";
import { IUploadingRepository } from "../../repository/Uploading";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";
import { IUploading } from "../../entity/Uploading/structures/interfaces";
import { IGetUploadingListUseCase } from "./interfaces";

export class GetUploadingListUseCase implements IGetUploadingListUseCase {
  constructor(private uploadingRepository: IUploadingRepository) {}
  async execute(): Promise<IList<IUploading>> {
    const model = new ListModel<IUploading>();

    const list = await this.uploadingRepository.getList();

    model.setItems(list);

    return model.list;
  }
}

injected(GetUploadingListUseCase, REPOSITORY.Uploading);
