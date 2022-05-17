import { injected } from "brandi";
import { IDeleteDocumentUseCase } from "../Document/interfaces";
import { DeleteEngineUseCase } from "../Engine/DeleteEngineUseCase";
import { REPOSITORY } from "../../../di/repository";

export class DeleteTransmissionUseCase
  extends DeleteEngineUseCase
  implements IDeleteDocumentUseCase {}

injected(DeleteTransmissionUseCase, REPOSITORY.Transmission);
