import { Route, Router } from "router5";
import { ErrorCollector } from "../ErrorCollector/ErrorCollector";
import { Container } from "brandi";
import { i18n } from "i18next";

export interface IBootstrap {
  initAPIClient(apiPrefix: string): void;
  initDI(): void;
  getInitialData(): Promise<void>;
  initRouter(routes: Route[]): void;
  initI18n(): Promise<void>;
  routerPostInit(): void;
  getDiContainer(): Container;
  getErrorCollector(): ErrorCollector;
  getRouter(): Router;
  getI18n(): i18n;
  dispose(): void;
}
