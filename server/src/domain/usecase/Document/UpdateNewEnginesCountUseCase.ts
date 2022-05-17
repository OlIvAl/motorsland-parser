import { UpdateNewItemsCountUseCase } from "./UpdateNewItemsCountUseCase";
import { IUpdateNewDocumentsCountUseCase } from "./interfaces";
import { injected } from "brandi";
import { REPOSITORY } from "../../../di/repository";

export class UpdateNewEnginesCountUseCase
  extends UpdateNewItemsCountUseCase
  implements IUpdateNewDocumentsCountUseCase {}

injected(UpdateNewEnginesCountUseCase, REPOSITORY.Engine);
