import { DependencyContainer, Lifecycle } from "tsyringe";
import { IDocumentListViewModel } from "../../../presentation/EngineListViewModel/interfaces";
import { EngineListViewModel } from "../../../presentation/EngineListViewModel";

export const VIEW_MODEL = {
  EngineList: Symbol.for("EngineListViewModel"),
};

/**
 * Return container with viewmodel child container
 */
export function getContainerWithViewModels(
  container: DependencyContainer
): DependencyContainer {
  container.register<IDocumentListViewModel>(
    VIEW_MODEL.EngineList,
    EngineListViewModel,
    {
      lifecycle: Lifecycle.Singleton,
    }
  );

  return container;
}
