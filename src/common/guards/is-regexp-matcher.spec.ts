import { expect } from 'chai';
import { isRegExpMatcher } from './is-regexp-matcher';
import { RegExpHttpMatcher, StringHttpMatcher } from '../../http/matchers';

describe('isRegExpMatcher', () => {
  it('should return true if provided argument is a RegExp matcher', () => {
    expect(isRegExpMatcher(RegExpHttpMatcher.of({ url: /\//, method: 'GET' }))).to.equal(true);
  });

  it('should return false if provided argument is not a RegExp matcher', () => {
    expect(isRegExpMatcher(StringHttpMatcher.of({ url: '', method: 'GET' }))).to.equal(false);
  });
});
