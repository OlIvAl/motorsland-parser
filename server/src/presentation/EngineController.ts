import { DocumentController } from "./DocumentController";
import { IDocumentController } from "./interfaces";
import { injected } from "brandi";
import { USE_CASE } from "../di/usecase";

export class EngineController
  extends DocumentController
  implements IDocumentController {}

injected(
  EngineController,
  USE_CASE.GetEngineList,
  USE_CASE.CreateEngine,
  USE_CASE.DeleteEngine,
  USE_CASE.UpdateNewEnginesCountUseCase
);
