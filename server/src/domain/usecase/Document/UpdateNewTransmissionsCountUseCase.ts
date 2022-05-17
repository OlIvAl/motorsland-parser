import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { injected } from "brandi";
import { UpdateNewItemsCountUseCase } from "./UpdateNewItemsCountUseCase";
import { REPOSITORY } from "../../../di/repository";

export class UpdateNewTransmissionsCountUseCase
  extends UpdateNewItemsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewTransmissionsCountUseCase, REPOSITORY.Transmission);
