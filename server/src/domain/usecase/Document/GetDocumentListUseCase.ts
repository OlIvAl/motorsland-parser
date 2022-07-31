import { IGetDocumentListUseCase } from "./interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document";
import { IDocumentList } from "../../entity/List/stuctures/interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { IUploadingRepository } from "../../repository/Uploading";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class GetDocumentListUseCase implements IGetDocumentListUseCase {
  constructor(private documentRepository: IDocumentRepository) {}
  async execute(uploading: UPLOADING_NAME): Promise<IDocumentList> {
    const model = new DocumentListModel();

    const [list] = await Promise.all([
      this.documentRepository.getDocuments(uploading),
    ]);

    model.setItems(list);

    return model.list;
  }
}

injected(GetDocumentListUseCase, REPOSITORY.Document);
