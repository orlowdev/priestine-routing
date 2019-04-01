import { IncomingMessage } from 'http';
import { PairInterface } from '../common/interfaces';
import { HttpMethods } from './enums';
import { isHttpMatcher } from './guards';
import { mergePrefixAndUrl } from './helpers';
import { HttpMatcherInterface, HttpRouteDataInterface } from './interfaces';
import { RegExpHttpMatcher, StringHttpMatcher } from './matchers';

/**
 * HTTP stores the map of registered routeMap internally represented as a
 * Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>.
 *
 * @class HttpRouteMap
 */
export class HttpRouteMap {
  /**
   * Create an empty HttpRouteMap.
   *
   * @returns {HttpRouteMap}
   */
  public static empty() {
    return new HttpRouteMap();
  }

  /**
   * Create HttpRouteMap from given Map.
   *
   * @param {Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>} routes
   * @returns {HttpRouteMap}
   */
  public static of(routes: Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>) {
    return new HttpRouteMap(routes);
  }

  /**
   * Internally stored route map.
   *
   * @type {Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>}
   * @private
   */
  protected _routes: Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>;

  /**
   * Internally stored prefix to be prepended to each created route.
   */
  protected _prefix: string | RegExp;

  /**
   * Map is sorted flag.
   *
   * @type {boolean}
   * @private
   */
  private _sorted: boolean = false;

  /**
   * Getter for _sorted.
   *
   * @returns {boolean}
   */
  public get sorted(): boolean {
    return this._sorted;
  }

  /**
   * @constructor
   * @param {Map<HttpMatcherInterface<string | RegExp>, (request, response) => any>} routes
   * @param {string | RegExp} prefix
   */
  public constructor(
    routes: Map<HttpMatcherInterface<string | RegExp>, (request, response) => any> = new Map(),
    prefix: string | RegExp = ''
  ) {
    this._routes = routes;
    this._prefix = prefix;
  }

  /**
   * Find matching route for current IncomingMessage and return an PairInterface<HttpRouteDataInterface, (request, response) => any>.
   *
   * @param {IncomingMessage} message
   * @returns {PairInterface<HttpRouteDataInterface, (request, response) => any>}
   */
  public find(message: IncomingMessage): PairInterface<HttpRouteDataInterface, (request, response) => any> {
    const route = Array.from(this._routes.keys()).find((x) => x.matches(message));

    const value = route ? this._routes.get(route) : undefined;

    const key = route ? { url: route.url, method: route.method } : undefined;

    return { key, value };
  }

  /**
   * Add a new route definition to a RouteMap.
   *
   * @param {string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {(request, response) => any} callback
   * @returns {this}
   */
  public add(
    url: string | RegExp | HttpMatcherInterface<any>,
    methods: Array<keyof typeof HttpMethods>,
    callback: (request, response) => any
  ) {
    methods.forEach((method) => {
      const key = (isHttpMatcher(url)
        ? url
        : typeof url === 'string'
          ? StringHttpMatcher.of({ url, method })
          : RegExpHttpMatcher.of({
              url: url as RegExp,
              method,
            })
      ).withPrefix(this._prefix);

      this._routes.set(key as HttpMatcherInterface, callback);
    });

    return this;
  }

  /**
   * Check if internal map has given key.
   *
   * @param {HttpMatcherInterface<string | RegExp>} key
   * @returns {boolean}
   */
  public has(key: HttpMatcherInterface<string | RegExp>): boolean {
    return !!Array.from(this._routes.keys()).find((x) => x.url === key.url && x.method === key.method);
  }

  /**
   * Concat current RouteMap with the one provided as parameter.
   * **NOTE**: if two maps have the same key, the key of the argument RouteMap will have priority over the key
   * of current RouteMap.
   *
   * @param {HttpRouteMap} o
   * @returns {HttpRouteMap}
   */
  public concat(o: HttpRouteMap): HttpRouteMap {
    for (const [k] of this._routes) {
      if (o.has(k)) {
        this._routes.delete(k);
      }
    }

    Array.from(o._routes.keys()).forEach((key) => {
      (key as any)._url = mergePrefixAndUrl(this._prefix, key.url);
    });

    return new HttpRouteMap(new Map([...this._routes, ...o._routes]), this._prefix);
  }

  /**
   * Sort internally stored Map to have routes matched by string before routes matched by RegExp.
   */
  public sort(): void {
    if (this._sorted) {
      return;
    }

    this._routes = new Map(Array.from(this._routes.entries()).sort((a, b) => a[0].complexity - b[0].complexity));

    this._sorted = true;
  }
}
