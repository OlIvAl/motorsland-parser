import { IGetListUseCase } from "./interfaces";
import { IDocumentListModel } from "../../entity/List/models/interfaces";
import { DocumentListModel } from "../../entity/List/models/DocumentListModel";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class GetDocumentListUseCase implements IGetListUseCase {
  constructor(private repository: IDocumentRepository) {}
  async execute(category: string): Promise<IDocumentListModel> {
    const model = new DocumentListModel();

    const result = await this.repository.getList(category);

    model.setList(result);

    return model;
  }
}

injected(GetDocumentListUseCase, REPOSITORY.Document);
