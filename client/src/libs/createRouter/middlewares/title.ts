import {
  Middleware,
  MiddlewareFactory,
  Route
} from 'router5/dist/types/router';
import { findSegment } from './libs/findSegment';
import { RouterDependencies } from '../../../index';

export const titleMiddlewareFactory = (
  routes: Route<RouterDependencies>[]
): MiddlewareFactory<RouterDependencies> => (): Middleware => (
  toState,
  fromState,
  done
): void => {
  const segment = findSegment(toState.name, routes);

  if (segment && (segment as any).title) {
    document.title = (segment as any).title;
  }

  done();
};
