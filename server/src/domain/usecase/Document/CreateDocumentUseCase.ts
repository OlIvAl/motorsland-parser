import { ICreateDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { IDocument } from "../../entity/Document/structures/interfaces";

export abstract class CreateDocumentUseCase implements ICreateDocumentUseCase {
  constructor(protected repository: IDocumentRepository) {}
  async execute(fields?: Record<string, string>): Promise<IDocument> {
    return await this.repository.create(fields as Record<string, string>);
  }
}
