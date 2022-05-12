import { ICreateItemUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";

export class CreateEngineUseCase implements ICreateItemUseCase {
  constructor(protected repository: IDocumentRepository) {}
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

injected(CreateEngineUseCase, REPOSITORY.Engine);
