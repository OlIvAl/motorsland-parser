import { UpdateNewDocumentsCountUseCase } from "../Document/UpdateNewDocumentsCountUseCase";
import { IUpdateNewDocumentsCountUseCase } from "../Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class UpdateNewTransmissionsCountUseCase
  extends UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewTransmissionsCountUseCase, REPOSITORY.Transmission);
