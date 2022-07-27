import { IGetDocumentHeadersUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class GetDocumentHeadersUseCase implements IGetDocumentHeadersUseCase {
  constructor(private repository: IDocumentRepository) {}

  async execute(): Promise<Record<string, string>> {
    const result = await this.repository.getHeaders();

    return { ...result, images: "Фотографии" };
  }
}

injected(GetDocumentHeadersUseCase, REPOSITORY.Document);
