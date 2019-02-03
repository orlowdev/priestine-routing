import { expect } from 'chai';
import { HttpRouter } from '../http-router';
import { withHttpRouter } from './serve-with-http-router';

describe('withHttpRouter', () => {
  it('should not fail if router is empty', () => {
    expect(() => withHttpRouter(HttpRouter.empty())({ url: '/', method: 'GET' } as any, {} as any)).to.not.throw();
  });

  it('should not fail if pipeline is empty', () => {
    expect(() =>
      withHttpRouter(HttpRouter.empty().get('/', []))({ url: '/', method: 'GET' } as any, {} as any)
    ).to.not.throw();
  });

  it('should sort routemap', () => {
    const rt = HttpRouter.empty()
      .get('/', [])
      .get('/1', []);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, {} as any);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, {} as any);
    expect(rt.routeMap.sorted).to.equal(true);
  });

  it('should run given pipeline', () => {
    const rt = HttpRouter.empty()
      .get('/', [() => {}])
      .get('/1', []);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, {} as any);
    expect(rt.routeMap.sorted).to.equal(true);
  });
});
