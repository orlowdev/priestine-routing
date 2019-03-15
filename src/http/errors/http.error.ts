import { STATUS_CODES } from 'http';

/**
 * HttpError is used to be thrown into the client instead of silently dying somewhere in the middle of the execution
 * process. It can be used to denote unwillingness of the server to process request and\or internal errors as well as
 * inject custom logic to be fired off in case the error occurs.
 *
 * @class HttpError
 * @extends Error
 *
 * @deprecated HttpError is going to be moved into separate package in future releases.
 */
export class HttpError extends Error {
  /**
   * Pointer interface to lift ordinary error into HttpError.
   *
   * @param {Error} e
   * @returns {HttpError}
   */
  public static from(e: Error) {
    return new HttpError(e.message).withStatusCode(500);
  }

  /**
   * Error HTTP status code.
   *
   * @type {number}
   */
  public statusCode: number;

  /**
   * Error HTTP status message.
   *
   * @type {string}
   */
  public statusMessage: string;

  public constructor(message?: string) {
    super(message);
  }

  /**
   * Chaining method for assigning given status code to the error.
   *
   * @param {number} statusCode
   * @returns {this}
   */
  public withStatusCode = (statusCode: number): this => {
    this.statusCode = statusCode;
    this.statusMessage = STATUS_CODES[statusCode];
    return this;
  };

  /**
   * Chaining method for assigning given status message to the error.
   *
   * @param {string} statusMessage
   * @returns {this}
   */
  public withStatusMessage = (statusMessage: string): this => {
    this.statusMessage = statusMessage;
    return this;
  };

  /**
   * Chaining method for assigning given message to the error.
   *
   * @param {string} message
   * @returns {this}
   */
  public withMessage = (message: string): this => {
    this.message = message;
    return this;
  };
}
