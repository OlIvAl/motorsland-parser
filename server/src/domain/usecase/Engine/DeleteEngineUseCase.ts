import { injected } from "brandi";
import { IDeleteDocumentUseCase } from "../Document/interfaces";
import { DeleteDocumentUseCase } from "../Document/DeleteDocumentUseCase";
import { REPOSITORY } from "../../../di/repository";

export class DeleteEngineUseCase
  extends DeleteDocumentUseCase
  implements IDeleteDocumentUseCase {}

injected(DeleteEngineUseCase, REPOSITORY.Engine);
