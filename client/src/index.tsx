import "reflect-metadata";
import { Bootstrap } from "./Bootstrap";
import { initBootstrap } from "./Bootstrap/initBootstrap";
import { IBootstrap } from "./Bootstrap/interfaces";
import { ICustomError } from "./libs/ErrorCollector/errors/interfaces";
import { renderApp } from "./UI";

export type RouterDependencies = Record<string, any>;

initBootstrap(new Bootstrap()).then((bootstrap: IBootstrap) => {
  const router = bootstrap.getRouter();
  const container = bootstrap.getDiContainer();
  const errorCollector = bootstrap.getErrorCollector();

  window.addEventListener("error", (errEvent): void => {
    errorCollector.setError<ICustomError>(errEvent.error);
  });

  router.start(() => {
    renderApp(router, container, errorCollector);
  });
});
