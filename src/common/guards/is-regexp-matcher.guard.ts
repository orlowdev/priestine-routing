import { RegExpHttpMatcher } from '../../http/matchers';

/**
 * Check if argument is a RegExp matcher.
 *
 * @param x
 * @returns {x is RegExpHttpMatcher}
 */
export const isRegExpMatcher = (x: any): x is RegExpHttpMatcher =>
  typeof x === 'object' && 'url' in x && typeof x.url !== 'string' && 'source' in x.url;
