import { PipelineInterface } from '@priestine/data';
import { HttpMethods } from './enums';
import { HttpRouteMap } from './http-route-map';
import { HttpMatcherInterface, HttpMiddlewareLike } from './interfaces';

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
   * @param {HttpMatcherInterface | string | RegExp} prefix
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
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {Array<keyof typeof HttpMethods>} methods
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {this}
   */
  public register(
    url: HttpMatcherInterface | string | RegExp,
    methods: Array<keyof typeof HttpMethods>,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ) {
    this._routeMap.add(url, methods, middleware);

    return this;
  }

  /**
   * Helper method for registering GET routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouteMap}
   */
  public get(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.GET], middleware);
  }

  /**
   * Helper method for registering POST routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public post(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.POST], middleware);
  }

  /**
   * Helper method for registering PUT routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public put(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.PUT], middleware);
  }

  /**
   * Helper method for registering PATCH routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public patch(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.PATCH], middleware);
  }

  /**
   * Helper method for registering DELETE routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public delete(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.DELETE], middleware);
  }

  /**
   * Helper method for registering OPTIONS routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public options(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.OPTIONS], middleware);
  }

  /**
   * Helper method for registering HEAD routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   * @param {HttpMatcherInterface | string | RegExp} url
   * @param {PipelineInterface | HttpMiddlewareLike[]} middleware
   * @returns {HttpRouter}
   */
  public head(
    url: HttpMatcherInterface | string | RegExp,
    middleware: PipelineInterface | HttpMiddlewareLike[]
  ): HttpRouter {
    return this.register(url, [HttpMethods.HEAD], middleware);
  }
}
