import { IGetDocumentHeadersUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { UPLOADING_NAME } from "../../../constants";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class GetDocumentHeadersUseCase implements IGetDocumentHeadersUseCase {
  constructor(private repository: IDocumentRepository) {}

  async execute(name?: UPLOADING_NAME): Promise<Record<string, string>> {
    const result = await this.repository.getHeaders(name);

    return { ...result, images: "Фото" };
  }
}

injected(GetDocumentHeadersUseCase, REPOSITORY.Document);
