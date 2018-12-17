/**
 * Describes route stored in the route map that can be mapped to current request.
 */
export interface IMatcher<TUrl, TRequest> {
  /**
   * URL that current request must match to be considered mappable.
   */
  url: TUrl;

  /**
   * Evaluate incoming message and deduce if it matches current route.
   *
   * @param {TRequest} message
   * @returns {boolean}
   */
  matches(message: TRequest): boolean;

  /**
   * Prepend given prefix to matcher URL.
   *
   * @param prefix
   * @returns {IMatcher<TUrl, TRequest>}
   */
  withPrefix(prefix: string | RegExp): IMatcher<TUrl, TRequest>;
}
