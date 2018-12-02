import { IMiddlewareContext } from './middleware-context.interface';

/**
 * Middleware function interface describes the function requirements to be considered Middleware function.
 *
 * @interface IMiddlewareContext<TContext extends IMiddlewareContext>
 */
export interface IMiddlewareFunction<TContext extends IMiddlewareContext> {
  (ctx: TContext): any;
}
