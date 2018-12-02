import { IRouteData } from './route-data.interface';

/**
 * Default context intermediate.
 *
 * @interface IDefaultIntermediate
 */
export interface IDefaultIntermediate {
  /**
   * Currently matched route data.
   */
  route: IRouteData;

  /**
   * Any internally caught error.
   */
  error?: Error;
}
