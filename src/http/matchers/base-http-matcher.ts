import { IncomingMessage } from 'http';
import { parse } from 'url';
import { MatcherInterface } from '../../common/interfaces';
import { HttpMethods } from '../enums';
import { HttpMatcherInterface } from '../interfaces';

/**
 * Base HTTP matcher.
 *
 * Matcher is used to define if current Node.js IncomingMessage object matches given route. For Node.js 'http'
 * package, IncomingMessage URL and HTTP method are checked for meeting requirements of given route. BaseHttpMatcher
 * provides common logic for deriving matchers that specify the `BaseHttpMatcher.matches` method.
 *
 * @class BaseHttpMatcher<T>
 * @implements HttpMatcherInterface<T>
 */
export abstract class BaseHttpMatcher<T> implements HttpMatcherInterface<T> {
  /**
   * URL for matching.
   *
   * @protected
   */
  protected _url: T;

  /**
   * HTTP method for matching.
   *
   * @protected
   */
  protected _method: keyof typeof HttpMethods;

  /**
   * @constructor
   * @param {T} url
   * @param {keyof typeof HttpMethods} method
   */
  public constructor({ url, method }: { url: T; method: keyof typeof HttpMethods }) {
    this._url = url;
    this._method = method;
  }

  /**
   * URL for matching.
   *
   * @returns {T}
   */
  public get url(): T {
    return this._url;
  }

  /**
   * Method for matching.
   *
   * @returns {keyof typeof HttpMethods}
   */
  public get method(): keyof typeof HttpMethods {
    return this._method;
  }

  /**
   * Check if current IncomingMessage matches current route.
   *
   * @param {string} url
   * @param {string} method
   * @returns {boolean}
   */
  public abstract matches({ url, method }: IncomingMessage): boolean;

  /**
   * Prepend given prefix to matcher URL.
   *
   * @param prefix
   * @returns {MatcherInterface<TUrl, TRequest>}
   */
  public abstract withPrefix(prefix: string | RegExp): HttpMatcherInterface<any>;

  /**
   * Complexity of the route.
   * For string matchers, the more /, the higher the complexity (initial complexity is 1).
   * For RegExp matchers, the more /, the lower the complexity (initial complexity is 1000000).
   */
  public abstract complexity: number;

  /**
   * Extract IncomingMessage URL pathname.
   *
   * @param {string} url
   * @returns {string}
   */
  protected getPathname(url: string): string {
    return parse(url).pathname;
  }
}
