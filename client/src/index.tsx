import { configure } from "mobx";
import { Bootstrap } from "./Bootstrap";
import { initBootstrap } from "./Bootstrap/initBootstrap";
import { IBootstrap } from "./Bootstrap/interfaces";
import { ICustomError } from "./ErrorCollector/errors/interfaces";
import { renderApp } from "./UI";

configure({ enforceActions: "observed" });

export type RouterDependencies = Record<string, any>;

initBootstrap(new Bootstrap())
  .then((bootstrap: IBootstrap) => {
    const router = bootstrap.getRouter();
    const i18n = bootstrap.getI18n();
    const container = bootstrap.getDiContainer();
    const errorCollector = bootstrap.getErrorCollector();

    window.addEventListener("error", (errEvent): void => {
      errorCollector.setError<ICustomError>(errEvent.error);
    });

    router.start(() => {
      renderApp(router, i18n, container, errorCollector);
    });
  })
  .catch((e: Error): void => {
    // renderErrorPage(e);
    throw e;
  });
