import { HttpMiddlewareFunctionInterface } from './http-middleware-function.interface';
import { HttpMiddlewareInterface } from './http-middleware.interface';

/**
 * Descriptor for HTTP Middleware represented as either class-based middleware or function middleware.
 *
 * @type HttpMiddlewareInterface | HttpMiddlewareFunctionInterface
 */
export type IHttpMiddlewareLike = HttpMiddlewareInterface | HttpMiddlewareFunctionInterface;
