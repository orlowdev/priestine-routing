import { expect } from 'chai';
import { HttpRouter } from '../http-router';
import { withHttpRouter } from './serve-with-http-router';

const response: any = { setHeader() {}, statusCode: 0, end() {} };

describe('withHttpRouter', () => {
  it('should not fail if router is empty', () => {
    expect(() => withHttpRouter(HttpRouter.empty())({ url: '/', method: 'GET' } as any, response)).to.not.throw();
  });

  it('should not fail if pipeline is empty', () => {
    expect(() =>
      withHttpRouter(HttpRouter.empty().get('/', []))({ url: '/', method: 'GET' } as any, response)
    ).to.not.throw();
  });

  it('should not fail if pipeline throws an error in the middle', () => {
    expect(() =>
      withHttpRouter(
        HttpRouter.empty().get('/', [
          () => {
            throw new Error();
          },
          () => {},
        ])
      )({ url: '/', method: 'GET' } as any, response)
    ).to.not.throw();
  });

  it('should sort routemap', () => {
    const rt = HttpRouter.empty()
      .get('/', [])
      .get('/1', []);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, response);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, response);
    expect(rt.routeMap.sorted).to.equal(true);
  });

  it('should run given pipeline', () => {
    const rt = HttpRouter.empty()
      .get('/', [() => {}])
      .get('/1', []);
    withHttpRouter(rt)({ url: '/', method: 'GET' } as any, response);
    expect(rt.routeMap.sorted).to.equal(true);
  });
});
