import { injected } from "brandi";
import { IGetDocumentListUseCase } from "../Document/interfaces";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { REPOSITORY } from "../../../di/repository";

export class GetEngineListUseCase
  extends GetDocumentListUseCase
  implements IGetDocumentListUseCase {}

injected(GetEngineListUseCase, REPOSITORY.Engine);
