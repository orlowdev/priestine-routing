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

  /**
   * Complexity of the route.
   * For string matchers, the more /, the higher the complexity (initial complexity is 1).
   * For RegExp matchers, the more /, the lower the complexity (initial complexity is 1000000).
   */
  complexity: number;
}
