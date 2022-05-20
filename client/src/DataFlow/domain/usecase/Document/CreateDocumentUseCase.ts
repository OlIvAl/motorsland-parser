import { ICreateItemUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class CreateDocumentUseCase implements ICreateItemUseCase {
  constructor(private repository: IDocumentRepository) {}
  // ToDo: make async generator
  async execute(
    model: IDocumentListModel,
    category: string
  ): Promise<IDocumentListModel> {
    model.setProgress();

    try {
      const result = await this.repository.create(category);

      model.setItem(result);
      model.setNewDocumentsCount(0);

      return model;
    } finally {
      model.unsetProgress();
    }
  }
}

injected(CreateDocumentUseCase, REPOSITORY.Document);
