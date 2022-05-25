import { IGetDocumentListUseCase } from "./interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document";
import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { IUploadingRepository } from "../../repository/Uploading";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class GetDocumentListUseCase implements IGetDocumentListUseCase {
  constructor(
    private documentRepository: IDocumentRepository,
    private uploadingRepository: IUploadingRepository
  ) {}
  async execute(uploading: UPLOADING_NAME): Promise<IDocumentList> {
    const model = new DocumentListModel();

    const [list, newDocumentsCount, progress] = await Promise.all([
      this.documentRepository.getDocuments(uploading),
      this.uploadingRepository.getNewDocumentsCount(uploading),
      this.uploadingRepository.getUploadingProgress(uploading),
    ]);

    model.setItems(list);
    model.setNewDocumentsCount(newDocumentsCount);
    model.setProgress(progress);

    return model.list;
  }
}

injected(GetDocumentListUseCase, REPOSITORY.Document, REPOSITORY.Uploading);
