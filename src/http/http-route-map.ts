import { isPipeline, Pipeline, PipelineInterface } from '@priestine/data/src';
import { IncomingMessage } from 'http';
import { isRegExpMatcher } from '../common/guards';
import { PairInterface } from '../common/interfaces';
import { HttpMethods } from './enums';
import { isHttpMatcher } from './guards';
import { mergePrefixAndUrl } from './helpers';
import { HttpMatcherInterface, HttpMiddlewareLike, HttpRouteDataInterface } from './interfaces';
import { RegExpHttpMatcher, StringHttpMatcher } from './matchers';

/**
 * HTTP stores the map of registered routeMap internally represented as a
 * Map<HttpMatcherInterface<string | RegExp>, HttpMiddlewareLike[]>.
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
   * @param {Map<HttpMatcherInterface<string | RegExp>, HttpMiddlewareLike[]>} routes
   * @returns {HttpRouteMap}
   */
  public static of(routes: Map<HttpMatcherInterface<string | RegExp>, PipelineInterface>) {
    return new HttpRouteMap(routes);
  }

  /**
   * Internally stored route map.
   *
   * @type {Map<HttpMatcherInterface<string | RegExp>, HttpMiddlewareLike[]>}
   * @private
   */
  protected _routes: Map<HttpMatcherInterface<string | RegExp>, PipelineInterface>;

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
   * @param {Map<HttpMatcherInterface<string | RegExp>, HttpMiddlewareLike[]>} routes
   * @param {string | RegExp} prefix
   */
  public constructor(
    routes: Map<HttpMatcherInterface<string | RegExp>, PipelineInterface> = new Map(),
    prefix: string | RegExp = ''
  ) {
    this._routes = routes;
    this._prefix = prefix;
  }

  /**
   * Find matching route for current IncomingMessage and return an PairInterface<HttpRouteDataInterface, PipelineInterface>.
   *
   * @param {IncomingMessage} message
   * @returns {PairInterface<HttpRouteDataInterface, PipelineInterface>}
   */
  public find(message: IncomingMessage): PairInterface<HttpRouteDataInterface, PipelineInterface> {
    const route = Array.from(this._routes.keys()).find((x) => x.matches(message));

    const value = route ? this._routes.get(route) : Pipeline.empty();

    const key = route ? { url: route.url, method: route.method } : undefined;

    return { key, value };
  }

  /**
   * Add a new route definition to a RouteMap.
   *
   * @param {string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {this}
   */
  public add(
    url: string | RegExp | HttpMatcherInterface<any>,
    methods: Array<keyof typeof HttpMethods>,
    middleware: PipelineInterface | HttpMiddlewareLike[]
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

      this._routes.set(key as HttpMatcherInterface, isPipeline(middleware) ? middleware : Pipeline.from(middleware));
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
   * Concat current RouteMap with the one provided as argument.
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

    return new HttpRouteMap(new Map([...this._routes, ...o._routes]) as any, this._prefix);
  }

  /**
   * Sort internally stored Map to have routeMap matched by string before routeMap matched by RegExp.
   */
  public sort(): void {
    if (this._sorted) {
      return;
    }

    this._routes = new Map(Array.from(this._routes.entries()).sort((x) => (isRegExpMatcher(x[0]) ? 1 : -1)));

    this._sorted = true;
  }
}
