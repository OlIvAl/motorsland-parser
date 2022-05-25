import { IUploadingRepository } from "../../../domain/repository/Uploading";
import { UPLOADING_NAME } from "../../../constants";
import { IUploadingTableClient } from "../../../dataSources/interfases";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../di/dataSource";

export class UploadingRepository implements IUploadingRepository {
  constructor(private uploadingTableClient: IUploadingTableClient) {}

  async getUploadingProgress(uploading: UPLOADING_NAME): Promise<boolean> {
    return await this.uploadingTableClient.getProgress(uploading);
  }
  async getCommonUploadingProgress(uploading: string): Promise<boolean> {
    return await this.uploadingTableClient.isAnyInProgress();
  }
  async getNewDocumentsCount(uploading: UPLOADING_NAME): Promise<number> {
    return await this.uploadingTableClient.getNewDocumentsCount(uploading);
  }
}

injected(UploadingRepository, DATA_SOURCE_REMOTE.UploadingTableClient);
