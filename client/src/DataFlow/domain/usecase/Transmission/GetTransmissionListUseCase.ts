import { injected } from "brandi";
import { REPOSITORY } from "../../../../Bootstrap/config/di/repository";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { IGetListUseCase } from "../Document/interfaces";

export class GetTransmissionListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetTransmissionListUseCase, REPOSITORY.Transmission);
