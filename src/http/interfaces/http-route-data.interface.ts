import { IRouteData } from '../../common/interfaces';
import { HttpMethods } from '../enums';

/**
 * Route data descriptor for matched route.
 *
 * @interface IRouteData
 */
export interface IHttpRouteData extends IRouteData {
  /**
   * HTTP method that current request matched.
   */
  method: keyof typeof HttpMethods;
}
