import { injected } from "brandi";
import { BUSINESS_MODELS } from "../../../Bootstrap/config/di/dataSource";
import { USE_CASE } from "../../../Bootstrap/config/di/usecase";
import { DocumentListViewModel } from "../DocumentListViewModel";
import { IDocumentListViewModel } from "../DocumentListViewModel/interfaces";

export class EngineListViewModel
  extends DocumentListViewModel
  implements IDocumentListViewModel {}

injected(
  EngineListViewModel,
  BUSINESS_MODELS.EngineList,
  USE_CASE.GetEngineList,
  USE_CASE.CreateEngine,
  USE_CASE.DeleteEngine
);
