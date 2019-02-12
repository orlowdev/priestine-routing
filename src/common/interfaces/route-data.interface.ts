/**
 * Route data descriptor for matched route.
 *
 * @interface RouteDataInterface
 */
export interface RouteDataInterface {
  /**
   * URL that current request matched.
   */
  url: string | RegExp;
}
