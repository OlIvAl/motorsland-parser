import { IBootstrap } from "./interfaces";
import { routes } from "./config/routes";
import { API_ROOT } from "./constants";

export function initBootstrap(bootstrap: IBootstrap): Promise<IBootstrap> {
  bootstrap.initDI();
  bootstrap.initAPIClient(API_ROOT);
  bootstrap.initRouter(routes as any[]);
  bootstrap.routerPostInit();

  return Promise.resolve(bootstrap);
}
