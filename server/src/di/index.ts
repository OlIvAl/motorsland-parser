import { Container } from "brandi";
import { getContainerWithDataSource } from "./dataSource";
import { getContainerWithReps } from "./repository";
import { getContainerWithUseCases } from "./usecase";
import { getContainerWithControllers } from "./controller";

export function getDIContainer(): Container {
  let container = new Container();

  container = getContainerWithDataSource(container);
  container = getContainerWithReps(container);
  container = getContainerWithUseCases(container);
  container = getContainerWithControllers(container);

  return container;
}
