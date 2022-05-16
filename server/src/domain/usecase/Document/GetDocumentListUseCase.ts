import { IGetListUseCase } from "./interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { IDocumentList } from "../../entity/List/stuctures/interfaces";

export abstract class GetDocumentListUseCase implements IGetListUseCase {
  constructor(protected repository: IDocumentRepository) {}
  async execute(): Promise<IDocumentList> {
    const model = new DocumentListModel();

    const [list, newItemsCount] = await Promise.all([
      this.repository.getDocuments(),
      this.repository.getNewItemsCount(),
    ]);

    model.setItems(list);
    model.setNewItemsCount(newItemsCount);

    return model.list;
  }
}
