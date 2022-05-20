import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase
{
  constructor(private repository: IDocumentRepository) {}

  async execute(
    model: IDocumentListModel,
    category: string
  ): Promise<IDocumentListModel> {
    const count = await this.repository.updateNewDocumentsCount(category);

    model.setNewDocumentsCount(count);

    return model;
  }
}

injected(UpdateNewDocumentsCountUseCase, REPOSITORY.Document);
