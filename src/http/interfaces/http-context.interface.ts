import { IncomingMessage, ServerResponse } from 'http';
import { DefaultHttpIntermediateInterface } from './default-http-intermediate.interface';
import { MiddlewareContextInterface } from '@priestine/data/src';

/**
 * Http context describes argument passed to each Middleware.process method.
 *
 * @interface HttpContextInterface
 * @extends MiddlewareContextInterface
 */
export interface HttpContextInterface<T = {}> extends MiddlewareContextInterface<T> {
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
  intermediate: DefaultHttpIntermediateInterface & T;
}
