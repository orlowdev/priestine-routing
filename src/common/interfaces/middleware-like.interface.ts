import { IMiddlewareContext } from './middleware-context.interface';
import { IMiddlewareFunction } from './middleware-function.interface';
import { IMiddleware } from './middleware.interface';

/**
 * Descriptor for Middleware represented as either class-based middleware or function middleware.
 *
 * @type IMiddleware<TContext> | IMiddlewareFunction<TContext>
 */
export type IMiddlewareLike<TContext extends IMiddlewareContext> =
  | IMiddleware<TContext>
  | IMiddlewareFunction<TContext>;
