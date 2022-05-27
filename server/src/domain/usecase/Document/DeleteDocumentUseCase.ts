import { IDeleteDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class DeleteDocumentUseCase implements IDeleteDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}
  async execute(uploading: UPLOADING_NAME, name: string): Promise<void> {
    // Если progress=true - выкидывать ошибку
    // await this.repository.delete(uploading, name);
    await new Promise((r) => setTimeout(r, 5000));
  }
}

injected(DeleteDocumentUseCase, REPOSITORY.Document);
