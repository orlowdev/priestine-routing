import { isMiddlewareObject } from '../common/guards';
import { IPipeline } from '../common/interfaces/pipeline.interface';
import { HttpRouter } from './http-router';
import { IHttpContext, IHttpMiddlewareLike } from './interfaces';

/**
 * HTTP pipeline sequentially executes provided middleware using an iterator passing the context.
 *
 * @class HttpPipeline
 * @implements IterableIterator<IHttpMiddlewareLike>
 */
export class HttpPipeline implements IPipeline<IHttpContext> {
  /**
   * Pointer interface for creating an HttpPipeline from given array of middleware.
   *
   * @param {Array<IHttpMiddlewareLike>} middleware
   * @returns {HttpPipeline}
   */
  public static of(middleware: IHttpMiddlewareLike[]): HttpPipeline {
    return new HttpPipeline(middleware);
  }

  /**
   * Pointer interface for creating an empty HttpPipeline.
   *
   * @returns {HttpPipeline}
   */
  public static empty(): HttpPipeline {
    return new HttpPipeline([]);
  }

  /**
   * Internally stored array of middleware.
   *
   * @type {IHttpMiddlewareLike[]}
   * @private
   */
  protected _middleware: IHttpMiddlewareLike[] = [];

  /**
   * Current iterator index.
   */
  protected _index: number = 0;

  /**
   * Iterator done flag.
   */
  protected _done: boolean = false;

  /**
   * @constructor
   * @param {Array<IHttpMiddlewareLike>} middleware
   */
  protected constructor(middleware: IHttpMiddlewareLike[]) {
    this._middleware = middleware;
  }

  /**
   * Pipeline has no middleware flag.
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    return !this._middleware.length;
  }

  /**
   * Getter for _done.
   * @returns {boolean}
   */
  public get done(): boolean {
    return this._done;
  }

  /**
   * Sequentially process middleware stored in current Pipeline.
   *
   * If the middleware returns a Promise, it will be resolved before moving on to the next middleware.
   *
   * @param ctx {IHttpContext}
   * @returns {Promise<void>}
   */
  public async $process(ctx: IHttpContext): Promise<void> {
    while (!this.done) {
      try {
        const next = this.next().value;
        const process = isMiddlewareObject(next) ? next.$process : next;
        await process(ctx);
      } catch (e) {
        ctx.intermediate.error = e;
        await HttpRouter.handleError(ctx);
        return;
      }
    }
  }

  /**
   * @returns {IterableIterator<IHttpMiddlewareLike>}
   */
  public [Symbol.iterator](): IterableIterator<IHttpMiddlewareLike> {
    return this;
  }

  /**
   * @param {IHttpMiddlewareLike} value
   * @returns {IteratorResult<IHttpMiddlewareLike>}
   */
  public next(value?: IHttpMiddlewareLike): IteratorResult<IHttpMiddlewareLike> {
    this._done = this.isEmpty || this._index === this._middleware.length - 1;

    return {
      done: this._done,
      value: this._middleware[this._index++],
    };
  }

  /**
   * @param value
   * @returns {IteratorResult<any>}
   */
  public throw(value?: any): IteratorResult<any> {
    this._done = true;

    return {
      done: this._done,
      value,
    };
  }
}
