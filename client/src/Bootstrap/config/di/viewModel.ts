import { IDocumentListViewModel } from "../../../presentation/EngineListViewModel/interfaces";
import { EngineListViewModel } from "../../../presentation/EngineListViewModel";
import { Container, token } from "brandi";

export const VIEW_MODEL = {
  EngineList: token<IDocumentListViewModel>("EngineListViewModel"),
};

/**
 * Return container with viewmodel child container
 */
export function getContainerWithViewModels(container: Container): Container {
  container
    .bind(VIEW_MODEL.EngineList)
    .toInstance(EngineListViewModel)
    .inSingletonScope();

  return container;
}
