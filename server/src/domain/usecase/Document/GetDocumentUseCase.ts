import { IGetDocumentUseCase } from "./interfaces";
import { IDocumentRepository } from "../../repository/Document";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";
import { Transform, Writable } from "stream";

export class GetDocumentUseCase implements IGetDocumentUseCase {
  constructor(private repository: IDocumentRepository) {}

  execute(
    name: string,
    formatter: Transform,
    writable: Writable
  ): Promise<Writable> {
    return this.repository.getDocument(name, formatter, writable);
  }
}

injected(GetDocumentUseCase, REPOSITORY.Document);
