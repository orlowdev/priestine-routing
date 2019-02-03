import { IHttpContext } from '../interfaces';
import { isMiddlewareContext } from '@priestine/data/src';

/**
 * Check if argument is middleware context.
 *
 * @param x
 * @returns {x is IHttpContext}
 */
export const isHttpMiddlewareContext = (x: any): x is IHttpContext =>
  isMiddlewareContext(x) && 'request' in x && 'response' in x;
