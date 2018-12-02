import { expect } from 'chai';
import { HttpRouteMap } from './http-route-map';

describe('HttpRouteMap', () => {
  describe('sort', () => {
    it('should sort internally stored map of routes by putting string-matched routes first', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], [])
        .add('/a', ['GET'], [])
        .add(/^\/123$/, ['GET'], [])
        .add('/456', ['GET'], []);

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
      expect(map.find({ url: '/', method: 'GET' } as any)).to.deep.equal({ key: undefined, value: [] });
    });

    it('should return key describing matched route and value with assigned pipeline if route was found', () => {
      const map = HttpRouteMap.empty()
        .add(/^\/$/, ['GET'], [])
        .add('/hello', ['GET'], []);

      expect(map.find({ url: '/hello', method: 'GET' } as any)).to.deep.equal({
        key: { url: '/hello', method: 'GET' },
        value: [],
      });

      expect(map.find({ url: '/', method: 'GET' } as any)).to.deep.equal({
        key: { url: /^\/$/, method: 'GET' },
        value: [],
      });
    });
  });
});
