import { ICreateDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { IDocument } from "../../entity/Document/structures/interfaces";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class CreateDocumentUseCase implements ICreateDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}
  async execute(uploading: UPLOADING_NAME): Promise<IDocument> {
    await new Promise((r) => setTimeout(r, 5000));
    // return await this.repository.create(uploading);
    return {
      id: `engines-${new Date().toISOString()}`,
      name: `engines-${new Date().toISOString()}`,
      createdOn: new Date(),
    };
  }
}

injected(CreateDocumentUseCase, REPOSITORY.Document);
