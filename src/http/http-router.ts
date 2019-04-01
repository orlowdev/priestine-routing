import { HttpMethods } from './enums';
import { HttpRouteMap } from './http-route-map';
import { HttpMatcherInterface } from './interfaces';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * HTTP router provides fluent interface for registering routeMap.
 *
 * @class HttpRouter
 */
export class HttpRouter {
  /**
   * Create an empty HttpRouter.
   */
  public static empty() {
    return new HttpRouter();
  }

  /**
   * Create an empty HttpRouter with prefix assigned to be added to each route url.
   */
  public static withPrefix(prefix: string | RegExp) {
    return HttpRouter.from(new HttpRouteMap(new Map(), prefix));
  }

  /**
   * Create an HttpRouter from given HttpRouteMap.
   */
  public static from(map: HttpRouteMap) {
    const router = HttpRouter.empty();
    router._routeMap = map;
    return router;
  }

  /**
   * Internally stored HttpRouteMap.
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
   */
  public concat(o: HttpRouter): HttpRouter {
    return HttpRouter.from(this.routeMap.concat(o.routeMap));
  }

  /**
   * Register a new route in the Router.routeMap.
   */
  public register(
    methods: Array<keyof typeof HttpMethods>,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public register(
    methods: Array<keyof typeof HttpMethods>,
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public register(...args) {
    const methods = args[0];
    const url = args.length > 2 ? args[1] : '';
    const callback = args.length > 2 ? args[2] : args[1];
    this._routeMap.add(url, methods, callback);

    return this;
  }

  /**
   * Helper method for registering GET routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public get(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public get(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public get(...args: any[]): HttpRouter {
    return this.register([HttpMethods.GET], args[0], args[1]);
  }

  /**
   * Helper method for registering POST routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public post(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public post(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public post(...args: any[]): HttpRouter {
    return this.register([HttpMethods.POST], args[0], args[1]);
  }

  /**
   * Helper method for registering PUT routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public put(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public put(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public put(...args: any[]): HttpRouter {
    return this.register([HttpMethods.PUT], args[0], args[1]);
  }

  /**
   * Helper method for registering PATCH routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public patch(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public patch(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public patch(...args: any[]): HttpRouter {
    return this.register([HttpMethods.PATCH], args[0], args[1]);
  }

  /**
   * Helper method for registering DELETE routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public delete(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public delete(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public delete(...args: any[]): HttpRouter {
    return this.register([HttpMethods.DELETE], args[0], args[1]);
  }

  /**
   * Helper method for registering OPTIONS routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public options(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public options(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public options(...args: any[]): HttpRouter {
    return this.register([HttpMethods.OPTIONS], args[0], args[1]);
  }

  /**
   * Helper method for registering HEAD routes.
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public head(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public head(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public head(...args: any[]): HttpRouter {
    return this.register([HttpMethods.HEAD], args[0], args[1]);
  }

  /**
   * Helper method for registering all common method routes (GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS).
   *
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
   */
  public all(callback: (request: IncomingMessage, response: ServerResponse) => any): HttpRouter;
  public all(
    url: HttpMatcherInterface | string | RegExp,
    callback: (request: IncomingMessage, response: ServerResponse) => any
  ): HttpRouter;
  public all(...args: any): HttpRouter {
    return this.get(args[0], args[1])
      .head(args[0], args[1])
      .post(args[0], args[1])
      .put(args[0], args[1])
      .patch(args[0], args[1])
      .delete(args[0], args[1])
      .options(args[0], args[1]);
  }
}
