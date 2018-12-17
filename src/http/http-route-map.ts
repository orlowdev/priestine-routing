import { IncomingMessage } from 'http';
import { isHttpMatcher, isMatcher, isPipeline, isRegExpMatcher } from '../common/guards';
import { IPair, IPipeline } from '../common/interfaces';
import { HttpMethods } from './enums';
import { mergePrefixAndUrl } from './helpers';
import { HttpPipeline } from './http-pipeline';
import { IHttpContext, IHttpMatcher, IHttpMiddlewareLike, IHttpRouteData } from './interfaces';
import { RegExpHttpMatcher, StringHttpMatcher } from './matchers';

/**
 * HTTP stores the map of registered routeMap internally represented as a
 * Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>.
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
   * @param {Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>} routes
   * @returns {HttpRouteMap}
   */
  public static of(routes: Map<IHttpMatcher<string | RegExp>, HttpPipeline>) {
    return new HttpRouteMap(routes);
  }

  /**
   * Internally stored route map.
   *
   * @type {Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>}
   * @private
   */
  protected _routes: Map<IHttpMatcher<string | RegExp>, IPipeline<IHttpContext>>;

  /**
   * Array of Middleware to be unshifted into each pipeline.
   *
   * @type {IHttpMiddlewareLike[]}
   * @private
   */
  protected _beforeEach: IPipeline<IHttpContext> = HttpPipeline.empty();

  /**
   * Array of Middleware to be pushed into each pipeline.
   *
   * @type {IHttpMiddlewareLike[]}
   * @private
   */
  protected _afterEach: IPipeline<IHttpContext> = HttpPipeline.empty();

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
   * @param {Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>} routes
   * @param {string | RegExp} prefix
   */
  public constructor(
    routes: Map<IHttpMatcher<string | RegExp>, HttpPipeline> = new Map(),
    prefix: string | RegExp = ''
  ) {
    this._routes = routes;
    this._prefix = prefix;
  }

  /**
   * Register middleware to be run before each Pipeline.
   *
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouteMap}
   */
  public beforeEach(middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouteMap {
    this._beforeEach = this._beforeEach.concat(isPipeline(middleware) ? middleware : HttpPipeline.of(middleware));

    return this;
  }

  /**
   * Register middleware to be run after each Pipeline.
   *
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouteMap}
   */
  public afterEach(middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouteMap {
    this._afterEach = this._afterEach.concat(isPipeline(middleware) ? middleware : HttpPipeline.of(middleware));

    return this;
  }

  /**
   * Find matching route for current IncomingMessage and return an IPair<IHttpRouteData, IHttpMiddlewareLike[]>.
   *
   * @param {IncomingMessage} message
   * @returns {IPair<IHttpRouteData, HttpPipeline>}
   */
  public find(message: IncomingMessage): IPair<IHttpRouteData, IPipeline<IHttpContext>> {
    const route = Array.from(this._routes.keys()).find((x) => x.matches(message));

    const value = route
      ? this._beforeEach.concat(this._routes.get(route)).concat(this._afterEach)
      : HttpPipeline.empty();

    const key = route ? { url: route.url, method: route.method } : undefined;

    return { key, value };
  }

  /**
   * Add a new route definition to a RouteMap.
   *
   * @param {string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {this}
   */
  public add(
    url: string | RegExp | IHttpMatcher<any>,
    methods: Array<keyof typeof HttpMethods>,
    middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]
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

      this._routes.set(key as IHttpMatcher<any>, isPipeline(middleware) ? middleware : HttpPipeline.of(middleware));
    });

    return this;
  }

  /**
   * Check if internal map has given key.
   *
   * @param {IHttpMatcher<string | RegExp>} key
   * @returns {boolean}
   */
  public has(key: IHttpMatcher<string | RegExp>): boolean {
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

    return new HttpRouteMap(new Map([...this._routes, ...o._routes]) as any, this._prefix)
      .beforeEach(this._beforeEach.concat(o._beforeEach))
      .afterEach(o._afterEach.concat(this._afterEach));
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
