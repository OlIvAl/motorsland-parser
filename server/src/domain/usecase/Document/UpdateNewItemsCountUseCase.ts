import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document/interfaces";

export class UpdateNewItemsCountUseCase
  implements IUpdateNewDocumentsCountUseCase
{
  constructor(protected repository: IDocumentRepository) {}

  async execute(): Promise<number> {
    return await this.repository.updateNewItemsCount();
  }
}
