import { IBootstrap } from "./interfaces";
import { routes } from "../Router/routes";
import { API_ROOT } from "./constants";

export async function initBootstrap(
  bootstrap: IBootstrap
): Promise<IBootstrap> {
  bootstrap.initDI();
  bootstrap.initAPIClient(API_ROOT);
  await bootstrap.getInitialData();
  bootstrap.initRouter(routes as any[]);
  await bootstrap.initI18n();
  bootstrap.routerPostInit();

  return Promise.resolve(bootstrap);
}
