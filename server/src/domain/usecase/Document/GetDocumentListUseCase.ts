import { IGetDocumentListUseCase } from "./interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { IDocumentList } from "../../entity/List/stuctures/interfaces";

export abstract class GetDocumentListUseCase
  implements IGetDocumentListUseCase
{
  constructor(protected repository: IDocumentRepository) {}
  async execute(): Promise<IDocumentList> {
    const model = new DocumentListModel();

    const [list, newDocumentsCount, progress] = await Promise.all([
      this.repository.getDocuments(),
      this.repository.getNewDocumentsCount(),
      this.repository.getProgress(),
    ]);

    model.setItems(list);
    model.setNewDocumentsCount(newDocumentsCount);
    model.setProgress(progress);

    return model.list;
  }
}
