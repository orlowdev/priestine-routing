import { MiddlewareFunctionInterface } from '@priestine/data/src';
import { HttpContextInterface } from './http-context.interface';

/**
 * HTTP middleware function interface describes the function requirements to be considered Middleware function.
 *
 * @type MiddlewareFunctionInterface<HttpContextInterface>
 */
export type HttpMiddlewareFunction = MiddlewareFunctionInterface<HttpContextInterface>;
