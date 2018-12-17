import { IDefaultHttpIntermediate } from './default-http-intermediate.interface';
import { IHttpContext } from './http-context.interface';

/**
 * Generic HTTP middleware context can be used to annotate the type of context intermediate.
 *
 * @interface IGenericHttpContext<TIntermediate>
 * @extends IHttpContext
 * @deprecated use IHttpContext<T> instead
 */
export interface IGenericHttpContext<TIntermediate> extends IHttpContext {
  /**
   * Type definition for the intermediate.
   */
  intermediate: IDefaultHttpIntermediate & TIntermediate;
}
