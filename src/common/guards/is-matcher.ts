import { MatcherInterface } from '../interfaces';

/**
 * Check if argument is a matcher.
 *
 * @param x
 * @returns {x is MatcherInterface<any>}
 */
export const isMatcher = (x: any): x is MatcherInterface<any, any> =>
  typeof x === 'object' && 'matches' in x && 'url' in x;
