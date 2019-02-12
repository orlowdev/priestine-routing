import { RouteDataInterface } from '../../common/interfaces';
import { HttpMethods } from '../enums';

/**
 * Route data descriptor for matched route.
 *
 * @interface RouteDataInterface
 */
export interface HttpRouteDataInterface extends RouteDataInterface {
  /**
   * HTTP method that current request matched.
   */
  method: keyof typeof HttpMethods;
}
