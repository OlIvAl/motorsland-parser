import { IGetDocumentUseCase } from "./interfaces";
import { IItemData } from "../../../dataSources/interfases";
import { IDocumentRepository } from "../../repository/Document";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class GetDocumentUseCase implements IGetDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}

  async execute(name: string): Promise<IItemData[]> {
    return this.repository.getDocumentWithPublicLink(name);
  }
}

injected(GetDocumentUseCase, REPOSITORY.Document);
