import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDeleteItemUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class DeleteDocumentUseCase implements IDeleteItemUseCase {
  constructor(private repository: IDocumentRepository) {}
  // ToDo: make async generator
  async execute(
    model: IDocumentListModel,
    id: ID,
    category: string
  ): Promise<IDocumentListModel> {
    await this.repository.delete(category, id);

    model.removeItem(id);

    return model;
  }
}

injected(DeleteDocumentUseCase, REPOSITORY.Document);
