import { RouteDataInterface } from './route-data.interface';

/**
 * Default context intermediate.
 *
 * @interface DefaultIntermediateInterface
 */
export interface DefaultIntermediateInterface {
  /**
   * Currently matched route data.
   */
  route: RouteDataInterface;

  /**
   * Any internally caught error.
   */
  error?: Error;
}
