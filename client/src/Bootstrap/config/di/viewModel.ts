import { EngineListViewModel } from "../../../presentation/EngineListViewModel";
import { Container, token } from "brandi";
import { TransmissionListViewModel } from "../../../presentation/TransmissionListViewModel";
import { IDocumentListViewModel } from "../../../presentation/DocumentListViewModel/interfaces";

export const VIEW_MODEL = {
  EngineList: token<IDocumentListViewModel>("EngineListViewModel"),
  TransmissionList: token<IDocumentListViewModel>("TransmissionListViewModel"),
};

/**
 * Return container with view model child container
 */
export function getContainerWithViewModels(container: Container): Container {
  container
    .bind(VIEW_MODEL.EngineList)
    .toInstance(EngineListViewModel)
    .inSingletonScope();
  container
    .bind(VIEW_MODEL.TransmissionList)
    .toInstance(TransmissionListViewModel)
    .inSingletonScope();

  return container;
}
