import { HttpContextInterface } from '../interfaces';
import { isMiddlewareContext } from '@priestine/data/src';

/**
 * Check if argument is middleware context.
 *
 * @param x
 * @returns {x is HttpContextInterface}
 */
export const isHttpMiddlewareContext = (x: any): x is HttpContextInterface =>
  isMiddlewareContext(x) && 'request' in x && 'response' in x;
