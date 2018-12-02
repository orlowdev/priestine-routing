import { expect } from 'chai';
import { HttpPipeline } from './http-pipeline';
import { HttpRouter } from './http-router';
import { HttpMiddlewareInterface } from './interfaces';

describe('HttpPipeline', () => {
  const f1 = (ctx) => ctx;
  const f2 = (ctx) => console.log(ctx);

  describe('Iterator', () => {
    it('[Symbol.iterator] should return reference to HttpPipeline', () => {
      expect(HttpPipeline.of([])[Symbol.iterator]()).to.be.instanceOf(HttpPipeline);
    });

    it('.next() should return the next middleware in the pipeline', () => {
      expect(HttpPipeline.of([f1, f2]).next().done).to.equal(false);
      expect(HttpPipeline.of([f1, f2]).next().value).to.equal(f1);

      const ppl = HttpPipeline.of([f1, f2]);
      ppl.next();
      const last = ppl.next();

      expect(last.done).to.equal(true);
      expect(last.value).to.equal(f2);
    });

    it('.throw() should notify that the pipeline is done and put the error to the value', () => {
      expect(HttpPipeline.of([]).throw(new Error()).done).to.equal(true);
      expect(HttpPipeline.of([]).throw(new Error('test')).value).to.match(/test/);
    });
  });

  describe('isEmpty', () => {
    it('should return true if Pipeline has no middleware', () => {
      expect(HttpPipeline.empty().isEmpty).to.equal(true);
    });

    it('should return false if Pipeline has at least middleware', () => {
      expect(HttpPipeline.of([() => 'hello world']).isEmpty).to.equal(false);
    });
  });

  describe('done', () => {
    it('should return boolean representing whether the Pipeline is done or not', () => {
      const ppl1 = HttpPipeline.of([f1]);
      ppl1.next();
      expect(ppl1.done).to.equal(true);
      const ppl2 = HttpPipeline.empty();
      ppl2.next();
      expect(ppl2.done).to.equal(true);
    });
  });

  describe('$process', () => {
    class CBM implements HttpMiddlewareInterface {
      public $process(ctx) {
        ctx.intermediate.id += 5;
      }
    }

    const fn1 = (ctx) => (ctx.intermediate.id = 1);
    const fn2 = (ctx) => (ctx.intermediate.id += 2);
    const fn3 = (ctx) => (ctx.intermediate.id += 3);
    const fnBroken = (ctx) => {
      throw new Error('test');
    };

    const successfulPipeline = HttpPipeline.of([fn1, fn2, fn3, new CBM()]);
    const brokenPipeline = HttpPipeline.of([fn1, fnBroken, fn3, new CBM()]);
    HttpRouter.onError([(ctx) => ctx]);

    it('should return result if the middleware execution did not cause any errors', async () => {
      const ctx = { intermediate: {} } as any;
      await successfulPipeline.$process(ctx);
      expect(ctx.intermediate.id).to.equal(11);
    });

    it('should run handle errors with Router-defined errorHandlers if errors occure', async () => {
      const ctx = { intermediate: {} } as any;
      await brokenPipeline.$process(ctx);
      expect(ctx.intermediate.error).to.match(/test/);
      expect(ctx.intermediate.id).to.equal(1);
    });
  });
});
