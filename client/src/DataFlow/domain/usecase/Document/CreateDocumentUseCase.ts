import { ICreateItemUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";

export abstract class CreateDocumentUseCase implements ICreateItemUseCase {
  constructor(protected repository: IDocumentRepository) {}
  // ToDo: make async generator
  async execute(model: IDocumentListModel): Promise<IDocumentListModel> {
    model.setProgress();

    try {
      const result = await this.repository.create();

      model.setItem(result);
      model.setNewDocumentsCount(0);

      return model;
    } finally {
      model.unsetProgress();
    }
  }
}
