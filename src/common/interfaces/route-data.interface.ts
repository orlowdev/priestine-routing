/**
 * Route data descriptor for matched route.
 *
 * @interface IRouteData
 */
export interface IRouteData {
  /**
   * URL that current request matched.
   */
  url: string | RegExp;
}
