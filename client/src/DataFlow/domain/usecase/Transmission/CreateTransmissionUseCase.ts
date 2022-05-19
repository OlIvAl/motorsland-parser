import { injected } from "brandi";
import { REPOSITORY } from "../../../config/repository";
import { CreateDocumentUseCase } from "../Document/CreateDocumentUseCase";
import { ICreateItemUseCase } from "../Document/interfaces";

export class CreateTransmissionUseCase
  extends CreateDocumentUseCase
  implements ICreateItemUseCase {}

injected(CreateTransmissionUseCase, REPOSITORY.Transmission);
