import { IDeleteDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";
import { ID } from "../../../interfaces";

export abstract class DeleteDocumentUseCase implements IDeleteDocumentUseCase {
  constructor(protected repository: IDocumentRepository) {}
  async execute(id: ID): Promise<void> {
    // Если progress=true - выкидывать ошибку
    await this.repository.delete(id);
  }
}
