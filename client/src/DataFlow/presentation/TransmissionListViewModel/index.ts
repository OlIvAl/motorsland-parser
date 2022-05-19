import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../config/dataSource";
import { USE_CASE } from "../../config/usecase";
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
  USE_CASE.DeleteTransmission,
  USE_CASE.UpdateNewTransmissionsCount
);
