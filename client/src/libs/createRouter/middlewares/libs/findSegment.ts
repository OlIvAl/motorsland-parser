import { Route } from 'router5/dist/types/router';

export const findSegment = (
  toStateName: string,
  routes: Route[]
): Route | null => {
  return toStateName
    .split('.')
    .reduce<Route | null>((curSegment, curRouteName: string) => {
      if (curSegment && curSegment.children) {
        return (
          curSegment.children.find((seg: Route) => seg.name === curRouteName) ||
          null
        );
      }
      return routes.find((seg: any) => seg.name === curRouteName) || null;
    }, null);
};
