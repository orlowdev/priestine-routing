import { IDefaultIntermediate } from './default-intermediate.interface';
import { IMiddlewareContext } from './middleware-context.interface';

/**
 * Generic middleware context can be used to annotate the type of context intermediate.
 *
 * @interface IGenericMiddlewareContext<TIntermediate>
 * @deprecated use IMiddlewareContext<T> instead
 */
export interface IGenericMiddlewareContext<TIntermediate> extends IMiddlewareContext {
  /**
   * Type definition for the intermediate.
   */
  intermediate: IDefaultIntermediate & TIntermediate;
}
