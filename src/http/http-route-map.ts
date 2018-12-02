import { IncomingMessage } from 'http';
import { isRegExpMatcher } from '../common/guards';
import { IPair } from '../common/interfaces';
import { HttpMethods } from './enums';
import { IHttpMatcher, IHttpMiddlewareLike, IHttpRouteData } from './interfaces';
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
  public static of(routes: Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>) {
    return new HttpRouteMap(routes);
  }

  /**
   * Internally stored route map.
   *
   * @type {Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>}
   * @private
   */
  protected _routes: Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]>;

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

  public constructor(routes: Map<IHttpMatcher<string | RegExp>, IHttpMiddlewareLike[]> = new Map()) {
    this._routes = routes;
  }

  /**
   * Find matching route for current IncomingMessage and return an IPair<IHttpRouteData, IHttpMiddlewareLike[]>.
   *
   * @param {IncomingMessage} message
   * @returns {IPair<IHttpRouteData, IHttpMiddlewareLike[]>}
   */
  public find(message: IncomingMessage): IPair<IHttpRouteData, IHttpMiddlewareLike[]> {
    const route = Array.from(this._routes.keys()).find((x) => x.matches(message));

    return route
      ? { key: { url: route.url, method: route.method }, value: this._routes.get(route) }
      : { key: undefined, value: [] };
  }

  /**
   * Add a new route definition to a RouteMap.
   *
   * @param {string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {IHttpMiddlewareLike[]} middleware
   * @returns {this}
   */
  public add(url: string | RegExp, methods: Array<keyof typeof HttpMethods>, middleware: IHttpMiddlewareLike[]) {
    methods.forEach((method) => {
      const key =
        typeof url === 'string' ? StringHttpMatcher.of({ url, method }) : RegExpHttpMatcher.of({ url, method });

      this._routes.set(key, middleware);
    });

    return this;
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
