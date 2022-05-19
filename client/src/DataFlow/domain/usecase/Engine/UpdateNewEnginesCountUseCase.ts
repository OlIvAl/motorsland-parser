import { UpdateNewDocumentsCountUseCase } from "../Document/UpdateNewDocumentsCountUseCase";
import { IUpdateNewDocumentsCountUseCase } from "../Document/interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";

export class UpdateNewEnginesCountUseCase
  extends UpdateNewDocumentsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewEnginesCountUseCase, REPOSITORY.Engine);
