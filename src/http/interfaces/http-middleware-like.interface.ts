import { HttpMiddlewareFunction } from './http-middleware.function';
import { HttpMiddlewareInterface } from './http-middleware.interface';

/**
 * Descriptor for HTTP Middleware represented as either class-based middleware or function middleware.
 *
 * @type HttpMiddlewareInterface | HttpMiddlewareFunction
 */
export type HttpMiddlewareLike = HttpMiddlewareInterface | HttpMiddlewareFunction;
