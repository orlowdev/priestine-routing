import { IHttpMiddlewareLike } from '../../http/interfaces';
import { IMiddlewareContext } from './middleware-context.interface';
import { IMiddlewareLike } from './middleware-like.interface';

/**
 * Describes pipeline.
 * @interface IPipeline<TContext extends IMiddlewareContext>
 */
export interface IPipeline<TContext extends IMiddlewareContext> extends IterableIterator<IMiddlewareLike<TContext>> {
  /**
   * Pipeline has no middleware flag.
   */
  isEmpty: boolean;

  /**
   * Iterator done flag.
   */
  done: boolean;

  /**
   * Sequentially process middleware stored in current Pipeline.
   *
   * @param {TContext} ctx
   * @returns {Promise<void>}
   */
  $process(ctx: TContext): Promise<void>;

  /**
   * Concat this pipeline with argument pipeline.
   *
   * @param {IPipeline<TContext>} x
   * @returns {IPipeline<TContext>}
   */
  concat(x: IPipeline<TContext>): IPipeline<TContext>;

  /**
   * @param {IHttpMiddlewareLike} value
   * @returns {IMiddlewareLike<TContext>}
   */
  next(value?: IHttpMiddlewareLike): IteratorResult<IMiddlewareLike<TContext>>;

  /**
   * @param value
   * @returns {IteratorResult<any>}
   */
  throw(value?: any): IteratorResult<any>;
}
