import { expect } from 'chai';
import { HttpError } from './http.error';

describe('HttpError', () => {
  describe('withStatusCode', () => {
    it('should assign given status code to error object', () => {
      expect(HttpError.from(new Error()).withStatusCode(333).statusCode).to.equal(333);
    });

    it('should apply status message to given status code if it is known', () => {
      expect(HttpError.from(new Error()).withStatusCode(404).statusMessage).to.equal('Not Found');
    });
  });

  describe('withStatusMessage', () => {
    it('should assign given status code to error object', () => {
      expect(HttpError.from(new Error()).withStatusMessage('Test').statusMessage).to.equal('Test');
    });
  });
});
