import { IHttpMatcher } from '../../http/interfaces';
import { isMatcher } from './is-matcher';

/**
 * Check if argument is an HTTP matcher.
 *
 * @param x
 * @returns {x is IHttpMatcher<any>}
 */
export const isHttpMatcher = (x: any): x is IHttpMatcher<any> => isMatcher(x) && 'method' in x;
