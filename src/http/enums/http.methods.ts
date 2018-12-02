/**
 * HTTP methods supported by Node.js. Put into an enum for easier access and typings.
 * Hint: do not use the prototype.
 *
 * @enum HttpMethods
 */
export enum HttpMethods {
  ACL = 'ACL',
  BIND = 'BIND',
  CHECKOUT = 'CHECKOUT',
  CONNECT = 'CONNECT',
  COPY = 'COPY',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  LINK = 'LINK',
  LOCK = 'LOCK',
  'M-SEARCH' = 'M-SEARCH',
  MERGE = 'MERGE',
  MKACTIVITY = 'MKACTIVITY',
  MKCALENDAR = 'MKCALENDAR',
  MKCOL = 'MKCOL',
  MOVE = 'MOVE',
  NOTIFY = 'NOTIFY',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PROPFIND = 'PROPFIND',
  PROPPATCH = 'PROPPATCH',
  PURGE = 'PURGE',
  PUT = 'PUT',
  REBIND = 'REBIND',
  REPORT = 'REPORT',
  SEARCH = 'SEARCH',
  SOURCE = 'SOURCE',
  SUBSCRIBE = 'SUBSCRIBE',
  TRACE = 'TRACE',
  UNBIND = 'UNBIND',
  UNLINK = 'UNLINK',
  UNLOCK = 'UNLOCK',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}
