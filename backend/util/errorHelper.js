/**
 * Thrown when User is not authorized to use functionality that is requested.
 * @class
 */
class UserNotAuthorizedError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when User is not found.
 * @class
 */
class UserNotFoundError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when Invoice is not found.
 * @class
 */
class InvoiceNotFoundError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when Invoice is not found.
 * @class
 */
class InvoiceItemNotFoundError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { UserNotAuthorizedError, UserNotFoundError, InvoiceNotFoundError, InvoiceItemNotFoundError };