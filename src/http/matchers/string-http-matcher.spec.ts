import { expect } from 'chai';
import { RegExpHttpMatcher } from './regexp-http-matcher';
import { StringHttpMatcher } from './string-http-matcher';

describe('StringHttpMatcher', () => {
  describe('.matches', () => {
    it('should return true if given IncomingMessage matches its requirements', () => {
      expect(StringHttpMatcher.of({ url: '/', method: 'GET' }).matches({ url: '/', method: 'GET' } as any)).to.equal(
        true
      );
    });

    it('should return false if given IncomingMessage does not match its requirements', () => {
      expect(StringHttpMatcher.of({ url: '/', method: 'GET' }).matches({ url: '/1', method: 'GET' } as any)).to.equal(
        false
      );
    });

    it('should not consider query params while matching', () => {
      expect(
        StringHttpMatcher.of({ url: '/', method: 'GET' }).matches({ url: '/?a=b', method: 'GET' } as any)
      ).to.equal(true);
    });

    it('should return RegExpHttpMatcher if prefix or url is a RegExp', () => {
      expect(StringHttpMatcher.of({ url: '/', method: 'GET' }).withPrefix(/\/api/)).to.be.instanceOf(RegExpHttpMatcher);
    });
  });
});
