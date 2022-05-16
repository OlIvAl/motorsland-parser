import { injected } from "brandi";
import { IGetListUseCase } from "../Document/interfaces";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { REPOSITORY } from "../../../di/repository";

export class GetEngineListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetEngineListUseCase, REPOSITORY.Engine);
