import { HttpMatcherInterface } from '../interfaces';
import { isMatcher } from '../../common/guards';

/**
 * Check if argument is an HTTP matcher.
 *
 * @param x
 * @returns {x is HttpMatcherInterface<any>}
 */
export const isHttpMatcher = (x: any): x is HttpMatcherInterface<any> => isMatcher(x) && 'method' in x;
