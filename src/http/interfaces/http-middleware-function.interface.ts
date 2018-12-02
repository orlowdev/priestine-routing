import { IMiddlewareFunction } from '../../common/interfaces';
import { IHttpContext } from './http-context.interface';

/**
 * HTTP middleware function interface describes the function requirements to be considered Middleware function.
 *
 * @type IMiddlewareFunction<IHttpContext>
 */
export type HttpMiddlewareFunctionInterface = IMiddlewareFunction<IHttpContext>;
