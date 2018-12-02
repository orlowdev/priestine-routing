import { IncomingMessage, ServerResponse } from 'http';
import { IMiddlewareContext } from '../../common/interfaces';
import { IDefaultHttpIntermediate } from './default-http-intermediate.interface';

/**
 * Http context describes argument passed to each Middleware.process method.
 * @interface IHttpContext
 * @extends IMiddlewareContext
 */
export interface IHttpContext extends IMiddlewareContext {
  /**
   * Node.js http.IncomingMessage.
   */
  request: IncomingMessage;

  /**
   * Node.js http.ServerResponse.
   */
  response: ServerResponse;

  /**
   * Data passed from previous middleware.
   */
  intermediate: IDefaultHttpIntermediate;
}
