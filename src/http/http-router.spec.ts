import { expect } from 'chai';
import { HttpRouteMap } from './http-route-map';
import { HttpRouter } from './http-router';
import { StringHttpMatcher } from './matchers';

describe('HttpRouter', () => {
  describe('routeMap', () => {
    it('should return internally stored HttpRouteMap', () => {
      expect(HttpRouter.empty().routeMap).to.be.instanceOf(HttpRouteMap);
    });
  });

  describe('register', () => {
    it('should register a route with given path, method and middleware', () => {
      const rt = HttpRouter.from(new HttpRouteMap());
      rt.register('/', ['GET'], []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'GET' })
      );
    });

    it('should register a route given multiple methods', () => {
      const rt = HttpRouter.empty();
      rt.register('/', ['GET', 'POST'], []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'GET' })
      );
      expect(Array.from((rt.routeMap as any)._routes.keys())[1]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'POST' })
      );
    });
  });

  describe('get', () => {
    it('should create a GET route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.get('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'GET' })
      );
    });
  });

  describe('post', () => {
    it('should create a POST route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.post('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'POST' })
      );
    });
  });

  describe('put', () => {
    it('should create a PUT route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.put('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'PUT' })
      );
    });
  });

  describe('patch', () => {
    it('should create a PATCH route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.patch('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'PATCH' })
      );
    });
  });

  describe('delete', () => {
    it('should create a DELETE route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.delete('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'DELETE' })
      );
    });
  });

  describe('options', () => {
    it('should create a OPTIONS route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.options('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'OPTIONS' })
      );
    });
  });

  describe('head', () => {
    it('should create a HEAD route with given path and middleware', () => {
      const rt = HttpRouter.empty();
      rt.head('/', []);
      expect(Array.from((rt.routeMap as any)._routes.keys())[0]).to.deep.equal(
        StringHttpMatcher.of({ url: '/', method: 'HEAD' })
      );
    });
  });

  describe('concat', () => {
    it('should concat return a Router', () => {
      expect(HttpRouter.empty().concat(HttpRouter.empty())).to.be.instanceOf(HttpRouter);
    });

    it('should merge route maps of both routers', () => {
      expect(
        HttpRouter.empty()
          .get('/', [])
          .concat(HttpRouter.empty().get('/1', []))
          .routeMap.has(StringHttpMatcher.of({ url: '/', method: 'GET' }))
      ).to.equal(true);
      expect(
        HttpRouter.empty()
          .get('/', [])
          .concat(HttpRouter.empty().get('/1', []))
          .routeMap.has(StringHttpMatcher.of({ url: '/1', method: 'GET' }))
      ).to.equal(true);
    });
  });

  describe('beforeEach', () => {
    it('should assign beforeEach middleware to the RouteMap', () => {
      const f1 = () => {};
      const f2 = () => {};

      expect(
        HttpRouter.empty()
          .get('/', [f1])
          .beforeEach([f2])
          .routeMap.find({ url: '/', method: 'GET' } as any).value
      ).to.deep.equal([f2, f1]);
    });
  });

  describe('afterEach', () => {
    it('should assign afterEach middleware to the RouteMap', () => {
      const f1 = () => {};
      const f2 = () => {};

      expect(
        HttpRouter.empty()
          .get('/', [f1])
          .afterEach([f2])
          .routeMap.find({ url: '/', method: 'GET' } as any).value
      ).to.deep.equal([f1, f2]);
    });

    it('should correctly add afterEach when concatenating routers', () => {
      const f1 = () => {};
      const f2 = () => {};
      const f3 = () => {};

      expect(
        HttpRouter.empty()
          .get('/', [f1])
          .afterEach([f2])
          .concat(HttpRouter.empty().afterEach([f3]))
          .routeMap.find({ url: '/', method: 'GET' } as any).value
      ).to.deep.equal([f1, f3, f2]);
    });

    it('should correctly add beforeEach when concatenating routers', () => {
      const f1 = () => {};
      const f2 = () => {};
      const f3 = () => {};

      expect(
        HttpRouter.empty()
          .get('/', [f1])
          .beforeEach([f2])
          .concat(HttpRouter.empty().beforeEach([f3]))
          .routeMap.find({ url: '/', method: 'GET' } as any).value
      ).to.deep.equal([f2, f3, f1]);
    });
  });
});
