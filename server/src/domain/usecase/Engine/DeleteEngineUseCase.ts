import { injected } from "brandi";
import { IDeleteItemUseCase } from "../Document/interfaces";
import { DeleteDocumentUseCase } from "../Document/DeleteDocumentUseCase";
import { REPOSITORY } from "../../../di/repository";

export class DeleteEngineUseCase
  extends DeleteDocumentUseCase
  implements IDeleteItemUseCase {}

injected(DeleteEngineUseCase, REPOSITORY.Engine);
