import { IncomingMessage } from 'http';
import { BaseHttpMatcher } from '../core';
import { HttpMethods } from '../enums';
import { mergePrefixAndUrl } from '../helpers';
import { HttpMatcherInterface } from '../interfaces';

/**
 * RegExp-based route. These are evaluated second.
 */
export class RegExpHttpMatcher extends BaseHttpMatcher<RegExp> {
  /**
   * Pointer interface for creating a RegExpHttpMatcher.
   *
   * @param {{url: RegExp; method: keyof HttpMethods}} x
   * @returns {RegExpHttpMatcher}
   */
  public static of(x: { url: RegExp; method: keyof typeof HttpMethods }): RegExpHttpMatcher {
    return new RegExpHttpMatcher(x);
  }

  /**
   * Check if current IncomingMessage matches current route.
   * @param {string} url
   * @param {string} method
   * @returns {boolean}
   */
  public matches({ url, method }: IncomingMessage): boolean {
    return this._method === method && this._url.test(super.getPathname(url));
  }

  /**
   * Prepend given prefix to matcher URL.
   *
   * @param prefix
   * @returns {MatcherInterface<TUrl, TRequest>}
   */
  withPrefix(prefix: string | RegExp): HttpMatcherInterface<any> {
    const url = mergePrefixAndUrl(prefix, this.url as any) as RegExp;
    const method = this._method;
    return RegExpHttpMatcher.of({ url, method });
  }

  /**
   * Get complexity of the route calculated from the amount of /.
   */
  public get complexity(): number {
    const match = this.url.source.match(/\//g);
    return 1000000000 - (match ? match.length : 1);
  }
}
