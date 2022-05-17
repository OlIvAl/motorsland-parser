import { injected } from "brandi";
import { GetDocumentListUseCase } from "../Document/GetDocumentListUseCase";
import { IGetDocumentListUseCase } from "../Document/interfaces";
import { REPOSITORY } from "../../../di/repository";

export class GetTransmissionListUseCase
  extends GetDocumentListUseCase
  implements IGetDocumentListUseCase {}

injected(GetTransmissionListUseCase, REPOSITORY.Transmission);
