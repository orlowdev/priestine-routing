import { expect } from 'chai';
import { HttpPipeline } from './http-pipeline';
import { HttpRouteMap } from './http-route-map';
import { StringHttpMatcher } from './matchers';

describe('HttpRouteMap', () => {
  describe('sort', () => {
    it('should sort internally stored map of routes by putting string-matched routes first', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], [])
        .add('/a', ['GET'], [])
        .add(/^\/123$/, ['GET'], [])
        .add(StringHttpMatcher.of({ url: '/456', method: 'GET' }), ['GET'], HttpPipeline.empty());

      expect((Array.from((map as any)._routes.keys())[0] as any).url).to.be.instanceOf(RegExp);
      map.sort();
      expect((Array.from((map as any)._routes.keys())[0] as any).url).to.be.a('string');
    });

    it('should only sort once', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], [])
        .add('/', ['GET'], []);

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
    it('should return value with empty array if route was not found', () => {
      const map = HttpRouteMap.empty();
      expect(map.find({ url: '/', method: 'GET' } as any).key).to.equal(undefined);
      expect(map.find({ url: '/', method: 'GET' } as any).value).to.be.instanceOf(HttpPipeline);
    });

    it('should return key describing matched route and value with assigned pipeline if route was found', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], [])
        .add('/hello', ['GET'], []);

      expect(map.find({ url: '/hello', method: 'GET' } as any).key).to.deep.equal({ url: '/hello', method: 'GET' });

      expect(map.find({ url: '/', method: 'GET' } as any).key).to.deep.equal({ url: /^\/$/, method: 'GET' });
    });
  });

  describe('concat', () => {
    it('should return an HttpRouteMap', () => {
      expect(HttpRouteMap.empty().concat(HttpRouteMap.empty())).to.be.instanceOf(HttpRouteMap);
    });

    it('should merge internally stored maps', () => {
      expect(
        HttpRouteMap.empty()
          .concat(
            HttpRouteMap.of(new Map([[StringHttpMatcher.of({ url: '/', method: 'GET' }), HttpPipeline.of([() => {}])]]))
          )
          .find({ url: '/', method: 'GET' } as any).value
      ).to.be.instanceOf(HttpPipeline);
    });

    it('should override current route key with argument route key if they overlap', () => {
      const f1 = (ctx) => ctx;
      expect(
        (HttpRouteMap.of(
          new Map([
            [StringHttpMatcher.of({ url: '/', method: 'GET' }), HttpPipeline.of([() => {}])],
            [StringHttpMatcher.of({ url: '/1', method: 'GET' }), HttpPipeline.of([() => {}])],
          ])
        )
          .concat(
            HttpRouteMap.of(new Map([[StringHttpMatcher.of({ url: '/', method: 'GET' }), HttpPipeline.of([f1])]]))
          )
          .find({ url: '/', method: 'GET' } as any).value as any)._middleware[0]
      ).to.equal(f1);
    });
  });

  describe('beforeEach', () => {
    const f1 = () => {};
    const f2 = () => {};

    it('should register routes to be run before each pipeline', () => {
      expect(
        (HttpRouteMap.empty()
          .beforeEach([f1])
          .add('/', ['GET'], [f2])
          .find({ url: '/', method: 'GET' } as any).value as any)._middleware
      ).to.deep.equal([f1, f2]);
    });

    it('should prepend beforeEach middleware even if they are defined after the pipeline', () => {
      expect(
        (HttpRouteMap.empty()
          .add('/', ['GET'], [f2])
          .beforeEach([f1])
          .find({ url: '/', method: 'GET' } as any).value as any)._middleware
      ).to.deep.equal([f1, f2]);
    });
  });

  describe('afterEach', () => {
    const f1 = () => {};
    const f2 = () => {};

    it('should register routes to be run after each pipeline', () => {
      expect(
        (HttpRouteMap.empty()
          .add('/', ['GET'], [f2])
          .afterEach([f1])
          .find({ url: '/', method: 'GET' } as any).value as any)._middleware
      ).to.deep.equal([f2, f1]);
    });

    it('should append afterEach middleware even if they are defined before the pipeline', () => {
      expect(
        (HttpRouteMap.empty()
          .afterEach([f1])
          .add('/', ['GET'], [f2])
          .find({ url: '/', method: 'GET' } as any).value as any)._middleware
      ).to.deep.equal([f2, f1]);
    });
  });
});
