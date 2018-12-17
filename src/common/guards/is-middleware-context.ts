import { IMiddlewareContext } from '../interfaces';

/**
 * Check if argument is middleware context.
 *
 * @param x
 * @returns {x is IMiddlewareContext}
 */
export const isMiddlewareContext = (x: any): x is IMiddlewareContext => typeof x === 'object' && 'intermediate' in x;
