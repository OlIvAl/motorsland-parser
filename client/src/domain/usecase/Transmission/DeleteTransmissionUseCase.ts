import { injected } from "brandi";
import { REPOSITORY } from "../../../Bootstrap/config/di/repository";
import { IDeleteItemUseCase } from "../Document/interfaces";
import { DeleteEngineUseCase } from "../Engine/DeleteEngineUseCase";

export class DeleteTransmissionUseCase
  extends DeleteEngineUseCase
  implements IDeleteItemUseCase {}

injected(DeleteTransmissionUseCase, REPOSITORY.Transmission);
