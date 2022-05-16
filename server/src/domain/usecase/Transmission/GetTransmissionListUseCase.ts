import { injected } from "brandi";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { IGetListUseCase } from "../Document/interfaces";
import { REPOSITORY } from "../../../di/repository";

export class GetTransmissionListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetTransmissionListUseCase, REPOSITORY.Transmission);
