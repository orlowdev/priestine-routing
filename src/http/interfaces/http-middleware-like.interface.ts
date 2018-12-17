import { IHttpMiddlewareFunction } from './http-middleware-function.interface';
import { IHttpMiddleware } from './http-middleware.interface';

/**
 * Descriptor for HTTP Middleware represented as either class-based middleware or function middleware.
 *
 * @type IHttpMiddleware | IHttpMiddlewareFunction
 */
export type IHttpMiddlewareLike = IHttpMiddleware | IHttpMiddlewareFunction;
