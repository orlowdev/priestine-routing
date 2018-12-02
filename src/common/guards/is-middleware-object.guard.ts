import { IMiddleware } from '../interfaces';

/**
 * Check if argument is a middleware object.
 *
 * @param x
 * @returns {x is IMiddleware<any>}
 */
export const isMiddlewareObject = (x: any): x is IMiddleware<any> => '$process' in x;
