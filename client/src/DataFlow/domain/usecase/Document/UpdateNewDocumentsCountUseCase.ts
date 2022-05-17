import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";

export class UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase
{
  constructor(protected repository: IDocumentRepository) {}

  async execute(model: IDocumentListModel): Promise<IDocumentListModel> {
    const count = await this.repository.updateNewItemsCount();

    model.setNewDocumentsCount(count);

    return model;
  }
}
