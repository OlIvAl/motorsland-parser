import { IGetListUseCase } from "../Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../../Bootstrap/config/di/repository";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";

export class GetEngineListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetEngineListUseCase, REPOSITORY.Engine);
