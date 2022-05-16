import { injected } from "brandi";
import { REPOSITORY } from "../../../../Bootstrap/config/di/repository";
import { CreateDocumentUseCase } from "../Document/CreateDocumentUseCase";
import { ICreateItemUseCase } from "../Document/interfaces";

export class CreateEngineUseCase
  extends CreateDocumentUseCase
  implements ICreateItemUseCase {}

injected(CreateEngineUseCase, REPOSITORY.Engine);
