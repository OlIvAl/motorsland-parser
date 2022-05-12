import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDeleteItemUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";

export class DeleteEngineUseCase implements IDeleteItemUseCase {
  constructor(protected repository: IDocumentRepository) {}
  // ToDo: make async generator
  async execute(
    id: ID,
    model: IDocumentListModel
  ): Promise<IDocumentListModel> {
    await this.repository.delete(id);

    model.removeItem(id);

    return model;
  }
}

injected(DeleteEngineUseCase, REPOSITORY.Engine);
