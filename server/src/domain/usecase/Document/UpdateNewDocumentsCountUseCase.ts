import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";

export class UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase
{
  constructor(protected repository: IDocumentRepository) {}

  async execute(): Promise<number> {
    return await this.repository.updateNewDocumentsCount();
  }
}
