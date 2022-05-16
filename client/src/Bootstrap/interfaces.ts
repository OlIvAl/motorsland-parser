import { Route, Router } from "router5";
import { ErrorCollector } from "../ErrorCollector/ErrorCollector";
import { Container } from "brandi";

export interface IBootstrap {
  initAPIClient(apiPrefix: string): void;
  initDI(): void;
  initRouter(routes: Route[]): void;
  routerPostInit(): void;
  getDiContainer(): Container;
  getErrorCollector(): ErrorCollector;
  getRouter(): Router;
  dispose(): void;
}
