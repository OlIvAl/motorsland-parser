import createRouter5, { Route, Router } from 'router5';
import { findSegment } from '../findSegment';

const routes: Route[] = [
  {
    name: 'index',
    path: '/'
  },
  {
    name: 'outer1',
    path: '/outer1',
    children: [
      {
        name: 'middle1',
        path: '/middle1'
      },
      {
        name: 'middle2',
        path: '/middle2',
        children: [
          {
            name: 'inner1',
            path: '/inner1'
          },
          {
            name: 'inner2',
            path: '/inner2'
          },
          {
            name: 'inner3',
            path: '/inner3'
          }
        ]
      },
      {
        name: 'middle3',
        path: '/middle3'
      }
    ]
  },
  {
    name: 'outer2',
    path: '/outer2'
  }
];

const createRouter = (routesArr: Route[]): Router => {
  return createRouter5(routesArr);
};

let router: Router;

describe('findSegment', () => {
  beforeEach(() => {
    router = createRouter(routes);
    router.start('/');
  });
  afterEach(() => {
    router.stop();
  });
  it('return right outer single segment', () => {
    expect.hasAssertions();

    expect(findSegment('outer1', routes)?.name).toStrictEqual('outer1');
  });
  it('return right inner segment', () => {
    expect.hasAssertions();

    expect(findSegment('outer1.middle2.inner3', routes)?.name).toStrictEqual(
      'inner3'
    );
  });
  it('return right middle segment', () => {
    expect.hasAssertions();

    expect(findSegment('outer1.middle2', routes)?.name).toStrictEqual(
      'middle2'
    );
  });
  it('return null, when inner segment is not exist', () => {
    expect.hasAssertions();

    expect(findSegment('outer1.middle20.inner3', routes)).toBeNull();
  });
  it('return null, when outer single segment is not exist', () => {
    expect.hasAssertions();

    expect(findSegment('outer100', routes)).toBeNull();
  });
});
