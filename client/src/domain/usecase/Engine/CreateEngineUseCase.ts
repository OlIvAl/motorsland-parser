import { ICreateItemUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { inject, injectable } from "tsyringe";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";
import { IDocumentRepository } from "../../repository/Document/interfaces";

@injectable()
export class CreateEngineUseCase implements ICreateItemUseCase {
  constructor(
    @inject(REPOSITORY.Engine) protected repository: IDocumentRepository
  ) {}
  // ToDo: make async generator
  async execute(model: IDocumentListModel): Promise<IDocumentListModel> {
    model.setProgress();

    try {
      const result = await this.repository.create();

      model.setItem(result);

      return model;
    } finally {
      model.unsetProgress();
    }
  }
}
