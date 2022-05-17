import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { injected } from "brandi";
import { UpdateNewDocumentsCountUseCase } from "./UpdateNewDocumentsCountUseCase";
import { REPOSITORY } from "../../../di/repository";

export class UpdateNewTransmissionsCountUseCase
  extends UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewTransmissionsCountUseCase, REPOSITORY.Transmission);
