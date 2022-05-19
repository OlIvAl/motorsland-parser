import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { IGetListUseCase } from "../Document/interfaces";

export class GetTransmissionListUseCase
  extends GetDocumentListUseCase
  implements IGetListUseCase {}

injected(GetTransmissionListUseCase, REPOSITORY.Transmission);
