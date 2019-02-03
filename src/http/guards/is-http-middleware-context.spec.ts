import { expect } from 'chai';
import { isHttpMiddlewareContext } from './is-http-middleware-context';

describe('isHttpMiddlewareContext', () => {
  it('should return true if argument is HttpContextInterface', () => {
    expect(isHttpMiddlewareContext({ request: 1, response: 2, intermediate: {} })).to.equal(true);
  });
});
