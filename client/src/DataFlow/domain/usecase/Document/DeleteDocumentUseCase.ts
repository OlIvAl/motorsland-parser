import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDeleteItemUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";

export abstract class DeleteDocumentUseCase implements IDeleteItemUseCase {
  constructor(protected repository: IDocumentRepository) {}
  // ToDo: make async generator
  async execute(
    id: ID,
    model: IDocumentListModel
  ): Promise<IDocumentListModel> {
    await this.repository.delete(id);
    const result = await this.repository.getList();

    model.setList(result);

    return model;
  }
}
