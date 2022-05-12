import { IGetListUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";

export class GetEngineListUseCase implements IGetListUseCase {
  constructor(protected repository: IDocumentRepository) {}
  async execute(): Promise<IDocumentListModel> {
    const model = new DocumentListModel();

    const result = await this.repository.getList();

    model.setList(result);

    return model;
  }
}

injected(GetEngineListUseCase, REPOSITORY.Engine);
