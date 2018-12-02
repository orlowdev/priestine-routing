import { IDefaultIntermediate } from '../../common/interfaces';
import { IHttpRouteData } from './http-route-data.interface';

/**
 * Default HTTP context intermediate.
 *
 * @interface IDefaultIntermediate
 */
export interface IDefaultHttpIntermediate extends IDefaultIntermediate {
  /**
   * Currently matched route data.
   */
  route: IHttpRouteData;
}
