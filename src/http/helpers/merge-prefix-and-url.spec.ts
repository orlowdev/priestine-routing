import { expect } from 'chai';
import { mergePrefixAndUrl } from './merge-prefix-and-url';

describe('mergePrefixAndUrl', () => {
  it('should return url if prefix is falsy', () => {
    expect(mergePrefixAndUrl('', '/')).to.equal('/');
  });

  it('should return prefixed url string for strings', () => {
    expect(mergePrefixAndUrl('/api', '/v1')).to.equal('/api/v1');
  });

  it('should return a string for strings', () => {
    expect(mergePrefixAndUrl('/api', '/v1')).to.be.a('string');
  });

  it('should return a RegExp if at leas one argument is a RegExp', () => {
    expect(mergePrefixAndUrl(/^\/api/, /\/v1/)).to.be.instanceOf(RegExp);
    expect(mergePrefixAndUrl('/api', /\/v1/)).to.be.instanceOf(RegExp);
    expect(mergePrefixAndUrl(/^\/api/, '/v1')).to.be.instanceOf(RegExp);
  });

  it('should return prefixed url RegExp for string prefix and RegExp url', () => {
    expect((mergePrefixAndUrl('/api', /\/v1/) as RegExp).source).to.equal('\\/api\\/v1');
  });

  it('should return prefixed url RegExp for RegExp prefix and string url', () => {
    expect((mergePrefixAndUrl(/^\/api/, '/v1') as RegExp).source).to.equal('^\\/api\\/v1');
  });

  it('should return prefixed url RegExp for RegExp', () => {
    expect((mergePrefixAndUrl(/^\/api/, /\/v1/) as RegExp).source).to.equal('^\\/api\\/v1');
  });
});
