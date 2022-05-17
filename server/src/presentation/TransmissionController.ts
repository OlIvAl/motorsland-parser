import { DocumentController } from "./DocumentController";
import { IDocumentController } from "./interfaces";
import { injected } from "brandi";
import { USE_CASE } from "../di/usecase";

export class TransmissionController
  extends DocumentController
  implements IDocumentController {}

injected(
  TransmissionController,
  USE_CASE.GetTransmissionList,
  USE_CASE.CreateTransmission,
  USE_CASE.DeleteTransmission,
  USE_CASE.UpdateNewTransmissionsCountUseCase
);
