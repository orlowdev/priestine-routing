import { IDefaultIntermediate } from './default-intermediate.interface';

/**
 * Middleware context descriptor. This context is provided as middleware function argument or class-based middleware
 * `$process` argument.
 *
 * @interface IMiddlewareContext
 */
export interface IMiddlewareContext<TAdditional = {}> {
  /**
   * Data passed from previous middleware.
   */
  intermediate: IDefaultIntermediate & TAdditional;
}
