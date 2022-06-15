import { IGetUploadingListUseCase } from "./interfaces";
import { IListModel } from "../../entity/List/models/interfaces";
import { IUploadingRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { IUploading } from "../../entity/Uploading/structures/interfaces";
import { ListModel } from "../../entity/List/models/ListModel";

export class GetUploadingListUseCase implements IGetUploadingListUseCase {
  constructor(private repository: IUploadingRepository) {}
  async execute(): Promise<IListModel<IUploading>> {
    const model = new ListModel<IUploading>();

    const result = await this.repository.getList();

    model.setItems(result);

    return model;
  }
}

injected(GetUploadingListUseCase, REPOSITORY.Uploading);
