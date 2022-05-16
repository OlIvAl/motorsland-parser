import createRouter5, { Route, Router } from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { titleMiddlewareFactory } from './middlewares/title';
import { onEnterMiddlewareFactory } from './middlewares/onEnter';

export const createRouter = (routes: Route[]): Router => {
  const router = createRouter5(routes, {
    allowNotFound: true,
    queryParamsMode: 'loose',
    autoCleanUp: false
  });

  router.usePlugin(browserPlugin());

  router.useMiddleware(
    titleMiddlewareFactory(routes),
    onEnterMiddlewareFactory(routes)
  );

  return router;
};
