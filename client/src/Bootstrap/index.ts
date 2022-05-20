import { IBootstrap } from "./interfaces";
import createRouter5, { Route, Router } from "router5";
import { ErrorCollector } from "../ErrorCollector/ErrorCollector";
import { createRouter } from "../Router";
import { getContainerWithReps } from "../DataFlow/config/repository";
import { getContainerWithUseCases } from "../DataFlow/config/usecase";
import { getContainerWithViewModels } from "../DataFlow/config/viewModel";
import { APIClient } from "../DataFlow/dataSource/API/APIClient";
import {
  DATA_SOURCE_REMOTE,
  getContainerWithDataSource,
} from "../DataFlow/config/dataSource";
import { Container } from "brandi";
import i18next, { i18n } from "i18next";
import { getI18Next } from "../I18n/getI18Next";
import { DocumentAPIClient } from "../DataFlow/dataSource/DocumentAPIClient";

export class Bootstrap implements IBootstrap {
  private container = new Container();
  private router = createRouter5();
  private i18n = i18next;
  private errorCollector = new ErrorCollector();

  constructor() {
    this.initDI = this.initDI.bind(this);
    this.initRouter = this.initRouter.bind(this);
    this.routerPostInit = this.routerPostInit.bind(this);
    this.dispose = this.dispose.bind(this);
  }
  initAPIClient(apiPrefix: string = ""): void {
    const apiClient = new APIClient(apiPrefix);
    const documentApiClient = new DocumentAPIClient(apiClient);

    this.container.bind(DATA_SOURCE_REMOTE.APIClient).toConstant(apiClient);
    this.container
      .bind(DATA_SOURCE_REMOTE.DocumentAPIClient)
      .toConstant(documentApiClient);
  }
  initDI(): void {
    this.container = getContainerWithDataSource(this.container);
    this.container = getContainerWithReps(this.container);
    this.container = getContainerWithUseCases(this.container);
    this.container = getContainerWithViewModels(this.container);
  }
  initRouter(routes: Route[]): void {
    this.router = createRouter(routes);
  }
  async initI18n(): Promise<void> {
    this.i18n = await getI18Next(this.i18n);
  }
  routerPostInit(): void {
    this.router.setDependency("container", this.container);
  }
  getDiContainer(): Container {
    return this.container;
  }
  getErrorCollector(): ErrorCollector {
    return this.errorCollector;
  }
  getRouter(): Router {
    return this.router;
  }
  getI18n(): i18n {
    return this.i18n;
  }

  dispose(): void {
    this.router.stop();
    this.container = new Container();
  }
}
