import { DefaultIntermediateInterface } from '../../common/interfaces';
import { HttpRouteDataInterface } from './http-route-data.interface';

/**
 * Default HTTP context intermediate.
 *
 * @interface DefaultIntermediateInterface
 */
export interface DefaultHttpIntermediateInterface extends DefaultIntermediateInterface {
  /**
   * Currently matched route data.
   */
  route: HttpRouteDataInterface;
}
