import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDeleteItemUseCase } from "./interfaces";
import { inject, injectable } from "tsyringe";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";
import { IDocumentRepository } from "../../repository/Document/interfaces";

@injectable()
export class DeleteEngineUseCase implements IDeleteItemUseCase {
  constructor(
    @inject(REPOSITORY.Engine) protected repository: IDocumentRepository
  ) {}
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
