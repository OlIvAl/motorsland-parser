import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";
import { UPLOADING_NAME } from "../../../constants";
import { IDocumentRepository } from "../../repository/Document";

export class UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase
{
  constructor(private repository: IDocumentRepository) {}

  async execute(uploading: UPLOADING_NAME): Promise<number> {
    return await this.repository.updateNewDocumentsCount(uploading);
  }
}

injected(UpdateNewDocumentsCountUseCase, REPOSITORY.Document);
