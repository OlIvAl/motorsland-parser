import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../../Bootstrap/config/di/dataSource";
import { USE_CASE } from "../../../Bootstrap/config/di/usecase";
import { DocumentListViewModel } from "../DocumentListViewModel";
import { IDocumentListViewModel } from "../DocumentListViewModel/interfaces";

export class TransmissionListViewModel
  extends DocumentListViewModel
  implements IDocumentListViewModel {}

injected(
  TransmissionListViewModel,
  BUSINESS_MODELS.TransmissionList,
  USE_CASE.GetTransmissionList,
  USE_CASE.CreateTransmission,
  USE_CASE.DeleteTransmission
);
