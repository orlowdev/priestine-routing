import { HttpContextInterface } from './http-context.interface';
import { MiddlewareInterface } from '@priestine/data/src';

/**
 * Interface each class-based HTTP middleware must implement to be considered as such.
 *
 * @interface MiddlewareInterface<HttpContextInterface>
 */
export interface HttpMiddlewareInterface extends MiddlewareInterface<HttpContextInterface> {}
