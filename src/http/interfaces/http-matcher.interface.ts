import { IncomingMessage } from 'http';
import { MatcherInterface } from '../../common/interfaces';
import { HttpMethods } from '../enums';

/**
 * Describes route stored in the route map that can be mapped to current request.
 */
export interface HttpMatcherInterface<T = string> extends MatcherInterface<T, IncomingMessage> {
  /**
   * HTTP method that current request must match to be considered mappable.
   */
  method: keyof typeof HttpMethods;
}
