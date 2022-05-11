import { IBootstrap } from "./interfaces";
import { container, DependencyContainer } from "tsyringe";
import createRouter5, { Route, Router } from "router5";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";
import { createRouter } from "../libs/createRouter";
import { getContainerWithReps } from "./config/di/repository";
import { getContainerWithUseCases } from "./config/di/usecase";
import { getContainerWithViewModels } from "./config/di/viewModel";
import { APIClient } from "../libs/API/APIClient";
import { IAPIClient } from "../libs/API/interfaces";
import {
  DATA_SOURCE_REMOTE,
  getContainerWithDataSource,
} from "./config/di/dataSource";

export class Bootstrap implements IBootstrap {
  private diContainer = container;
  private router = createRouter5();
  private errorCollector = new ErrorCollector();

  constructor() {
    this.initDI = this.initDI.bind(this);
    this.initRouter = this.initRouter.bind(this);
    this.routerPostInit = this.routerPostInit.bind(this);
    this.dispose = this.dispose.bind(this);
  }
  initAPIClient(apiPrefix: string = ""): void {
    this.diContainer.registerInstance<IAPIClient>(
      DATA_SOURCE_REMOTE.APIClient,
      new APIClient(apiPrefix)
    );
  }
  initDI(): void {
    this.diContainer = getContainerWithDataSource(this.diContainer);
    this.diContainer = getContainerWithReps(this.diContainer);
    this.diContainer = getContainerWithUseCases(this.diContainer);
    this.diContainer = getContainerWithViewModels(this.diContainer);
  }
  initRouter(routes: Route[]): void {
    this.router = createRouter(routes);
  }
  routerPostInit(): void {
    this.router.setDependency("container", this.diContainer);
  }
  getDiContainer(): DependencyContainer {
    return this.diContainer;
  }
  getErrorCollector(): ErrorCollector {
    return this.errorCollector;
  }
  getRouter(): Router {
    return this.router;
  }
  dispose(): void {
    this.router.stop();
    this.diContainer.reset();
  }
}
