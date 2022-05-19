import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { CreateDocumentUseCase } from "../Document/CreateDocumentUseCase";
import { ICreateItemUseCase } from "../Document/interfaces";

export class CreateEngineUseCase
  extends CreateDocumentUseCase
  implements ICreateItemUseCase {}

injected(CreateEngineUseCase, REPOSITORY.Engine);
