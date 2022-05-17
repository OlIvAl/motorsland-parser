import { UpdateNewDocumentsCountUseCase } from "./UpdateNewDocumentsCountUseCase";
import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class UpdateNewEnginesCountUseCase
  extends UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewEnginesCountUseCase, REPOSITORY.Engine);
