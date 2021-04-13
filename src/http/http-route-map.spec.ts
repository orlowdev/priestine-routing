import { expect } from 'chai';
import { HttpRouteMap } from './http-route-map';
import { StringHttpMatcher } from './matchers';

describe('HttpRouteMap', () => {
  describe('sort', () => {
    it('should sort internally stored map of routes by putting string-matched routes first', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], () => {})
        .add('/a', ['GET'], () => {})
        .add('', ['GET'], () => {})
        .add(/.*/, ['GET'], () => {})
        .add(/^\/123$/, ['GET'], () => {})
        .add(StringHttpMatcher.of({ url: '/456', method: 'GET' }), ['GET'], () => {});

      expect((Array.from((map as any)._routes.keys())[0] as any).url).to.be.instanceOf(RegExp);
      map.sort();
      expect((Array.from((map as any)._routes.keys())[0] as any).url).to.be.a('string');
    });

    it('should only sort once', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], () => {})
        .add('/', ['GET'], () => {});

      expect(map.sort()).to.deep.equal(map.sort());
    });
  });

  describe('sorted', () => {
    it('should return the value of the _sorted flag', () => {
      const map = HttpRouteMap.of([] as any);
      expect(map.sorted).to.equal(false);
      map.sort();
      expect(map.sorted).to.equal(true);
    });
  });

  describe('find', () => {
    it('should return undefined key and value if route was not found', () => {
      const map = HttpRouteMap.empty();
      expect(map.find({ url: '/', method: 'GET' } as any).key).to.equal(undefined);
      expect(map.find({ url: '/', method: 'GET' } as any).value).to.equal(undefined);
    });

    it('should return key describing matched route and value with assigned pipeline if route was found', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], () => {})
        .add('/hello', ['GET'], () => {});

      expect(map.find({ url: '/hello', method: 'GET' } as any).key).to.deep.equal({ url: '/hello', method: 'GET' });

      expect(map.find({ url: '/', method: 'GET' } as any).key).to.deep.equal({ url: /^\/$/, method: 'GET' });
    });

    it('should return correct callback as pair value when the route is matched', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], fn1)
        .add('/hello', ['GET'], fn2);

      expect(map.find({ url: '/hello', method: 'GET' } as any).value).to.equal(fn2);
    });
  });

  describe('concat', () => {
    it('should return an HttpRouteMap', () => {
      expect(HttpRouteMap.empty().concat(HttpRouteMap.empty())).to.be.instanceOf(HttpRouteMap);
    });

    it('should merge internally stored maps', () => {
      const fn = () => {};
      expect(
        HttpRouteMap.empty()
          .concat(HttpRouteMap.of(new Map([[StringHttpMatcher.of({ url: '/', method: 'GET' }), fn]])))
          .find({ url: '/', method: 'GET' } as any).value
      ).to.equal(fn);
    });

    it('should override current route key with argument route key if they overlap', () => {
      const f1 = (ctx) => ctx;
      expect(HttpRouteMap.of(
        new Map([
          [StringHttpMatcher.of({ url: '/', method: 'GET' }), () => {}],
          [StringHttpMatcher.of({ url: '/1', method: 'GET' }), () => {}],
        ])
      )
        .concat(HttpRouteMap.of(new Map([[StringHttpMatcher.of({ url: '/', method: 'GET' }), f1]])))
        .find({ url: '/', method: 'GET' } as any).value as any).to.equal(f1);
    });
  });
});
