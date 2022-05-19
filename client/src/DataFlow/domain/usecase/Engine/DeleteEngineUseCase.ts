import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { IDeleteItemUseCase } from "../Document/interfaces";
import { DeleteDocumentUseCase } from "../Document/DeleteDocumentUseCase";

export class DeleteEngineUseCase
  extends DeleteDocumentUseCase
  implements IDeleteItemUseCase {}

injected(DeleteEngineUseCase, REPOSITORY.Engine);
