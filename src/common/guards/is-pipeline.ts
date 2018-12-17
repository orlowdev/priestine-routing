import { IPipeline } from '../interfaces';

/**
 * Check if argument is a pipeline.
 *
 * @param x
 * @returns {x is IMiddleware<any>}
 */
export const isPipeline = (x: any): x is IPipeline<any> => '$process' in x && 'done' in x && 'isEmpty' in x;
