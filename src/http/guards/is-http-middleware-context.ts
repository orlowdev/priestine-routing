import { isMiddlewareContext } from '../../common/guards';
import { IHttpContext } from '../interfaces';

/**
 * Check if argument is middleware context.
 *
 * @param x
 * @returns {x is IHttpContext}
 */
export const isHttpMiddlewareContext = (x: any): x is IHttpContext =>
  isMiddlewareContext(x) && 'request' in x && 'response' in x;
