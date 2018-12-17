import { IMatcher } from '../interfaces';

/**
 * Check if argument is a matcher.
 *
 * @param x
 * @returns {x is IMatcher<any>}
 */
export const isMatcher = (x: any): x is IMatcher<any, any> => typeof x === 'object' && 'matches' in x && 'url' in x;
