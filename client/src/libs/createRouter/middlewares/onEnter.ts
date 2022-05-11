import { MiddlewareFactory, Route } from 'router5/dist/types/router';
import { findSegment } from './libs/findSegment';
import { RouterDependencies } from '../../../index';

export const onEnterMiddlewareFactory = (
  routes: Route<RouterDependencies>[]
): MiddlewareFactory<RouterDependencies> => (router) => (
  toState,
  fromState
): boolean => {
  const segment = findSegment(toState.name, routes);

  if (segment && (segment as any).onEnter) {
    (segment as any).onEnter(router, toState.params, fromState?.params);
  }

  return true;
};
