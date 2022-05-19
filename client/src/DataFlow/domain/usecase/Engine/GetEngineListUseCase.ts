import { IGetListUseCase } from "../Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";

export class GetEngineListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetEngineListUseCase, REPOSITORY.Engine);
