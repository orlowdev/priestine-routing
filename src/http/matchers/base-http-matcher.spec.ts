import { expect } from 'chai';
import { StringHttpMatcher } from './';

describe('BaseHttpMatcher', () => {
  describe('url', () => {
    it('should return its stored url value', () => {
      expect(StringHttpMatcher.of({ url: '/', method: 'GET' }).url).to.equal('/');
    });
  });

  describe('method', () => {
    it('should return its stored method value', () => {
      expect(StringHttpMatcher.of({ url: '/', method: 'GET' }).method).to.equal('GET');
    });
  });

  describe('getPathname', () => {
    it('should return pathname from current IncomingMessage url', () => {
      expect((StringHttpMatcher.of({} as any) as any).getPathname('/a/b/?c=d')).to.equal('/a/b/');
    });
  });
});
