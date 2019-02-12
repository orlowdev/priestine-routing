import { expect } from 'chai';
import { RegExpHttpMatcher } from './regexp-http-matcher';

describe('RegExpHttpMatcher', () => {
  describe('.matches', () => {
    it('should return true if given IncomingMessage matches its requirements', () => {
      expect(
        RegExpHttpMatcher.of({ url: /^\/?$/, method: 'GET' }).matches({ url: '/', method: 'GET' } as any)
      ).to.equal(true);
    });

    it('should return false if given IncomingMessage does not match its requirements', () => {
      expect(
        RegExpHttpMatcher.of({ url: /^\/?$/, method: 'GET' }).matches({ url: '/', method: 'GET' } as any)
      ).to.equal(true);
    });

    it('should not consider query params while matching', () => {
      expect(
        RegExpHttpMatcher.of({ url: /^\/?$/, method: 'GET' }).matches({ url: '/?a=b', method: 'GET' } as any)
      ).to.equal(true);
    });

    it('should return RegExpHttpMatcher even if prefix or url is a string', () => {
      expect(RegExpHttpMatcher.of({ url: /^\/?$/, method: 'GET' }).withPrefix('/api')).to.be.instanceOf(
        RegExpHttpMatcher
      );
    });
  });
});
