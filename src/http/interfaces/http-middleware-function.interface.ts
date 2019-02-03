import { MiddlewareFunctionInterface } from '@priestine/data/src';
import { IHttpContext } from './http-context.interface';

/**
 * HTTP middleware function interface describes the function requirements to be considered Middleware function.
 *
 * @type MiddlewareFunctionInterface<IHttpContext>
 */
export type IHttpMiddlewareFunction = MiddlewareFunctionInterface<IHttpContext>;
