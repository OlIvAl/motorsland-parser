import { IUploadingRepository } from "../../../domain/repository/Uploading";
import { UPLOADING_NAME } from "../../../constants";
import { IUploadingTableClient } from "../../../dataSources/interfases";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";
import { IUploading } from "../../../domain/entity/Uploading/structures/interfaces";

export class UploadingRepository implements IUploadingRepository {
  constructor(private uploadingTableClient: IUploadingTableClient) {}

  async getList(): Promise<IUploading[]> {
    return await this.uploadingTableClient.getList();
  }
}

injected(UploadingRepository, DATA_SOURCE_REMOTE.UploadingTableClient);
