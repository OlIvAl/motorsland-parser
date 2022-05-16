import createRouter5, { Route, Router } from 'router5';
import { titleMiddlewareFactory } from '../title';
import * as faker from 'faker';

const TEST_TITLE = faker.random.word();

const routes = [
  {
    name: 'home',
    path: '/'
  },
  {
    name: 'pages',
    path: '/pages',
    title: TEST_TITLE
  },
  {
    name: 'items',
    path: '/items'
  }
];

const createRouter = (routesArr: Route[]): Router => {
  const router = createRouter5(routesArr);

  router.useMiddleware(titleMiddlewareFactory(routes));

  return router;
};

let router: Router;

describe('title middleware', () => {
  beforeAll(() => {
    router = createRouter(routes);
  });

  beforeEach(() => {
    router.start();
  });
  afterEach(() => {
    router.stop();
    global.window.document.title = '';
  });
  it('set title from route to document title, if it is exist', () => {
    expect.hasAssertions();

    router.navigate('pages');

    expect(global.window.document.title).toStrictEqual(TEST_TITLE);
  });
  it('do not set title from route to document title, if it is not exist', () => {
    expect.hasAssertions();

    router.navigate('page');

    expect(global.window.document.title).toStrictEqual('');
  });
});
