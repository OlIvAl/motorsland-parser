import { Route, Router } from "router5";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";
import { DependencyContainer } from "tsyringe";

export interface IBootstrap {
  initAPIClient(apiPrefix: string): void;
  initDI(): void;
  initRouter(routes: Route[]): void;
  routerPostInit(): void;
  getDiContainer(): DependencyContainer;
  getErrorCollector(): ErrorCollector;
  getRouter(): Router;
  dispose(): void;
}
