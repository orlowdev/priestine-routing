import { IncomingMessage } from 'http';
import { BaseHttpMatcher } from '../core';
import { HttpMethods } from '../enums';
import { mergePrefixAndUrl } from '../helpers';
import { HttpMatcherInterface } from '../interfaces';
import { RegExpHttpMatcher } from './regexp-http-matcher';

/**
 * String-based route matcher. String-based route matchers should be used at all times when no dynamic content is
 * expected inside the URL as the evaluation for string matcher is faster than RegExp-based matchers thus evaluated
 * prior to the latter.
 *
 * @class StringHttpMatcher
 * @extends BaseHttpMatcher<string>
 */
export class StringHttpMatcher extends BaseHttpMatcher<string> {
  /**
   * Pointer interface for creating a StringHttpMatcher.
   *
   * @param {{url: string; method: keyof HttpMethods}} x
   * @returns {StringHttpMatcher}
   */
  public static of(x: { url: string; method: keyof typeof HttpMethods }): StringHttpMatcher {
    return new StringHttpMatcher(x);
  }

  /**
   * Check if current IncomingMessage matches current route.
   * @param {string} url
   * @param {string} method
   * @returns {boolean}
   */
  public matches({ url, method }: IncomingMessage): boolean {
    return this._url === super.getPathname(url) && this._method === method;
  }

  /**
   * Prepend given prefix to matcher URL.
   *
   * @param prefix
   * @returns {MatcherInterface<TUrl, TRequest>}
   */
  public withPrefix(prefix: string | RegExp): HttpMatcherInterface<any> {
    const url = mergePrefixAndUrl(prefix, this.url as any);
    const method = this._method;
    return typeof url === 'string' ? StringHttpMatcher.of({ url, method }) : RegExpHttpMatcher.of({ url, method });
  }

  /**
   * Get complexity of the route calculated from the amount of /.
   */
  public get complexity(): number {
    const match = this.url.match(/\//g);
    return match ? match.length : 1;
  }
}
