import { IHttpContext } from './http-context.interface';
import { MiddlewareInterface } from '@priestine/data/src';

/**
 * Interface each class-based HTTP middleware must implement to be considered as such.
 *
 * @interface MiddlewareInterface<IHttpContext>
 */
export interface IHttpMiddleware extends MiddlewareInterface<IHttpContext> {}
