import { IMiddleware } from '../../common/interfaces';
import { IHttpContext } from './http-context.interface';

/**
 * Interface each class-based HTTP middleware must implement to be considered as such.
 *
 * @interface IMiddleware<IHttpContext>
 */
export interface IHttpMiddleware extends IMiddleware<IHttpContext> {}
