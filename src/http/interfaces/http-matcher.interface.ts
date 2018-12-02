import { IncomingMessage } from 'http';
import { IMatcher } from '../../common/interfaces';
import { HttpMethods } from '../enums';

/**
 * Describes route stored in the route map that can be mapped to current request.
 */
export interface IHttpMatcher<T> extends IMatcher<T, IncomingMessage> {
  /**
   * HTTP method that current request must match to be considered mappable.
   */
  method: keyof typeof HttpMethods;
}
