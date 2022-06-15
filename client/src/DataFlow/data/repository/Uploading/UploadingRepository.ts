import { IUploadingRepository } from "../../../domain/repository/Document/interfaces";
import { IUploading } from "../../../domain/entity/Uploading/structures/interfaces";
import { IAPIClient } from "../../../dataSource/API/interfaces";
import { injected } from "brandi";
import { DATA_SOURCE_REMOTE } from "../../../config/dataSource";

export class UploadingRepository implements IUploadingRepository {
  constructor(private apiClient: IAPIClient) {}

  async getList(): Promise<IUploading[]> {
    return await this.apiClient.getData<null, IUploading[]>("uploadings");
  }
}

injected(UploadingRepository, DATA_SOURCE_REMOTE.APIClient);
