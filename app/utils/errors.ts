/**
 * HTTP接口响应错误
 * @param code
 * @param message
 */
function HttpResponseError(this: any, code: number, message: string) {
  this.name = 'HttpResponseError';
  this.code = code;
  this.message = message;
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);
}

HttpResponseError.prototype = Object.create(Error.prototype);
HttpResponseError.prototype.constructor = HttpResponseError;

export { HttpResponseError };
