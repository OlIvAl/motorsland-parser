import { ICreateDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class CreateDocumentUseCase implements ICreateDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}
  async execute(sourceName: string): Promise<IDocument> {
    return await this.repository.create(sourceName);
  }
}

injected(CreateDocumentUseCase, REPOSITORY.Document);
