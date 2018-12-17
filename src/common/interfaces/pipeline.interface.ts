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
   * @param {TContext} ctx
   * @returns {Promise<void>}
   */
  $process(ctx: TContext): Promise<void>;
}
