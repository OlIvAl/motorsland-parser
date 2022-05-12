import { IBootstrap } from "./interfaces";
import createRouter5, { Route, Router } from "router5";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";
import { createRouter } from "../libs/createRouter";
import { getContainerWithReps } from "./config/di/repository";
import { getContainerWithUseCases } from "./config/di/usecase";
import { getContainerWithViewModels } from "./config/di/viewModel";
import { APIClient } from "../libs/API/APIClient";
import {
  DATA_SOURCE_REMOTE,
  getContainerWithDataSource,
} from "./config/di/dataSource";
import { Container } from "brandi";

export class Bootstrap implements IBootstrap {
  private container = new Container();
  private router = createRouter5();
  private errorCollector = new ErrorCollector();

  constructor() {
    this.initDI = this.initDI.bind(this);
    this.initRouter = this.initRouter.bind(this);
    this.routerPostInit = this.routerPostInit.bind(this);
    this.dispose = this.dispose.bind(this);
  }
  initAPIClient(apiPrefix: string = ""): void {
    this.container
      .bind(DATA_SOURCE_REMOTE.APIClient)
      .toConstant(new APIClient(apiPrefix));
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
  dispose(): void {
    this.router.stop();
    this.container = new Container();
  }
}
