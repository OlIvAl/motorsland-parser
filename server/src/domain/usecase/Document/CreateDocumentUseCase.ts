import { ICreateDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class CreateDocumentUseCase implements ICreateDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}
  async execute(uploading: UPLOADING_NAME): Promise<IDocument> {
    return await this.repository.create(uploading);
  }
}

injected(CreateDocumentUseCase, REPOSITORY.Document);
