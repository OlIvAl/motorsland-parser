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

    const [list, newItemsCount, progress] = await Promise.all([
      this.repository.getDocuments(),
      this.repository.getNewItemsCount(),
      this.repository.getProgress(),
    ]);

    model.setItems(list);
    model.setNewItemsCount(newItemsCount);
    model.setProgress(progress);

    return model.list;
  }
}
