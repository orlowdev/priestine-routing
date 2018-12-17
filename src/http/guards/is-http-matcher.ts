import { IHttpMatcher } from '../interfaces';
import { isMatcher } from '../../common/guards';

/**
 * Check if argument is an HTTP matcher.
 *
 * @param x
 * @returns {x is IHttpMatcher<any>}
 */
export const isHttpMatcher = (x: any): x is IHttpMatcher<any> => isMatcher(x) && 'method' in x;
