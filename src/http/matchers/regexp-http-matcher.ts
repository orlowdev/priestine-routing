import { IncomingMessage } from 'http';
import { BaseHttpMatcher } from '../core';
import { HttpMethods } from '../enums';
import { mergePrefixAndUrl } from '../helpers';
import { IHttpMatcher } from '../interfaces';
import { StringHttpMatcher } from './string-http-matcher';

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
   * @returns {IMatcher<TUrl, TRequest>}
   */
  withPrefix(prefix: string | RegExp): IHttpMatcher<any> {
    const url = mergePrefixAndUrl(prefix, this.url as any);
    const method = this._method;
    return typeof url === 'string' ? StringHttpMatcher.of({ url, method }) : RegExpHttpMatcher.of({ url, method });
  }
}
