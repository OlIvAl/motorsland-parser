import { injected } from "brandi";
import { IDeleteItemUseCase } from "../Document/interfaces";
import { DeleteEngineUseCase } from "../Engine/DeleteEngineUseCase";
import { REPOSITORY } from "../../../di/repository";

export class DeleteTransmissionUseCase
  extends DeleteEngineUseCase
  implements IDeleteItemUseCase {}

injected(DeleteTransmissionUseCase, REPOSITORY.Transmission);
