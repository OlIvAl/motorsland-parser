import { IGetListUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { inject, injectable } from "tsyringe";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";
import { IDocumentRepository } from "../../repository/Document/interfaces";

@injectable()
export class GetEngineListUseCase implements IGetListUseCase {
  constructor(
    @inject(REPOSITORY.Engine) protected repository: IDocumentRepository
  ) {}
  async execute(): Promise<IDocumentListModel> {
    const model = new DocumentListModel();

    const result = await this.repository.getList();

    model.setList(result);

    return model;
  }
}
