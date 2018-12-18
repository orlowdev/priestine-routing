import { expect } from 'chai';
import { HttpPipeline } from '../http-pipeline';
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

  it('should emit pipelineError event if error was thrown', () => {
    let test;
    HttpRouter.eventEmitter.on('pipelineError', () => (test = 1));
    const errorPpl = HttpPipeline.of([
      (ctx) => {
        throw new Error('test');
      },
    ]);
    withHttpRouter(HttpRouter.empty().get('/', errorPpl))({ url: '/', method: 'GET' } as any, {} as any);
    expect(test).to.equal(1);
  });
});
