import { IPipeline } from '../common/interfaces';
import { HttpMethods } from './enums';
import { HttpPipeline } from './http-pipeline';
import { HttpRouteMap } from './http-route-map';
import { IHttpContext, IHttpMiddlewareLike } from './interfaces';

/**
 * HTTP router provides fluent interface for registering routeMap.
 *
 * @class HttpRouter
 */
export class HttpRouter {
  /**
   * Create an empty HttpRouter.
   *
   * @returns {HttpRouter}
   */
  public static empty() {
    return new HttpRouter();
  }

  /**
   * Create an empty HttpRouter with prefix assigned to be added to each route url.
   *
   * @param {string | RegExp} prefix
   * @returns {HttpRouter}
   */
  public static withPrefix(prefix: string | RegExp) {
    return HttpRouter.from(new HttpRouteMap(new Map(), prefix));
  }

  /**
   * Create an HttpRouter from given HttpRouteMap.
   *
   * @param {HttpRouteMap} map
   * @returns {HttpRouter}
   */
  public static from(map: HttpRouteMap) {
    const router = HttpRouter.empty();
    router._routeMap = map;
    return router;
  }

  /**
   * Handle caught error by creating an emergency Pipeline from the HttpRouter.errorHandlers and process it using
   * current context.
   *
   * @param {IHttpContext} ctx
   */
  public static handleError(ctx: IHttpContext): void {
    HttpPipeline.of(HttpRouter.errorHandlers).$process(ctx);
  }

  /**
   * Array of error handler middleware. This middleware is used by Router.handleError for processing unhandled errors.
   *
   * @type {((ctx: IHttpContext) => void)[]}
   */
  protected static _errorHandlers: IHttpMiddlewareLike[] = [];

  /**
   * Register middleware to handle errors that occur during pipeline execution.
   *
   * **NOTE**: this is going to get deprecated soon.
   *
   * @param {IHttpMiddlewareLike[]} middleware
   */
  public static onError(middleware: IHttpMiddlewareLike[]): void {
    this._errorHandlers = middleware;
  }

  /**
   * Getter for _errorHandlers.
   *
   * @returns {IHttpMiddlewareLike[]}
   */
  public static get errorHandlers(): IHttpMiddlewareLike[] {
    return this._errorHandlers;
  }

  /**
   * Internally stored HttpRouteMap.
   *
   * @type {HttpRouteMap}
   * @private
   */
  protected _routeMap: HttpRouteMap = HttpRouteMap.empty();

  /**
   * Getter for _routeMap.
   */
  public get routeMap(): HttpRouteMap {
    return this._routeMap;
  }

  /**
   * Register middleware to be run before each Pipeline.
   *
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public beforeEach(middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    this._routeMap.beforeEach(middleware);

    return this;
  }

  /**
   * Register middleware to be run after each Pipeline.
   *
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public afterEach(middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    this._routeMap.afterEach(middleware);

    return this;
  }

  /**
   * Concat two Routers to create a new Router that has RouteMaps of both Routers merged.
   *
   * @param {HttpRouter} o
   * @returns {HttpRouter}
   */
  public concat(o: HttpRouter): HttpRouter {
    return HttpRouter.from(this.routeMap.concat(o.routeMap));
  }

  /**
   * Register a new route in the Router.routeMap.
   *
   * @param {string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {this}
   */
  public register(
    url: string | RegExp,
    methods: Array<keyof typeof HttpMethods>,
    middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]
  ) {
    this._routeMap.add(url, methods, middleware);

    return this;
  }

  /**
   * Helper method for registering GET routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouteMap}
   */
  public get(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.GET], middleware);
  }

  /**
   * Helper method for registering POST routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public post(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.POST], middleware);
  }

  /**
   * Helper method for registering PUT routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public put(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.PUT], middleware);
  }

  /**
   * Helper method for registering PATCH routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public patch(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.PATCH], middleware);
  }

  /**
   * Helper method for registering DELETE routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public delete(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.DELETE], middleware);
  }

  /**
   * Helper method for registering OPTIONS routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public options(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.OPTIONS], middleware);
  }

  /**
   * Helper method for registering HEAD routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {string | RegExp} url
   * @param {IPipeline<IHttpContext> | IHttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public head(url: string | RegExp, middleware: IPipeline<IHttpContext> | IHttpMiddlewareLike[]): HttpRouter {
    return this.register(url, [HttpMethods.HEAD], middleware);
  }
}
