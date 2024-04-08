import { CommonError } from '../types/error.types';

const commonErrorsDictionary: { [key: string]: CommonError } = {
  notFound: {
    name: 'Not found',
    httpCode: 404
  },
  internalServerError: {
    name: 'Internal server error',
    httpCode: 500
  },
  badRequest: {
    name: 'Bad request',
    httpCode: 400
  },
  unauthorized: {
    name: 'Unauthorized',
    httpCode: 401
  },
  forbidden: {
    name: 'Forbidden',
    httpCode: 403
  },
  methodNotAllowed: {
    name: 'Method not allowed',
    httpCode: 405
  },
  conflict: {
    name: 'Conflict',
    httpCode: 409
  },
  tooManyRequests: {
    name: 'Too many requests',
    httpCode: 429
  },
  serviceUnavailable: {
    name: 'Service unavailable',
    httpCode: 503
  },
  gatewayTimeout: {
    name: 'Gateway timeout',
    httpCode: 504
  },
  preconditionFailed: {
    name: 'Precondition failed',
    httpCode: 412
  },
  lengthRequired: {
    name: 'Length required',
    httpCode: 411
  },
  requestEntityTooLarge: {
    name: 'Request entity too large',
    httpCode: 413
  },
  requestUriTooLong: {
    name: 'Request URI too long',
    httpCode: 414
  },
  unsupportedMediaType: {
    name: 'Unsupported media type',
    httpCode: 415
  },
  requestedRangeNotSatisfiable: {
    name: 'Requested range not satisfiable',
    httpCode: 416
  },
  expectationFailed: {
    name: 'Expectation failed',
    httpCode: 417
  },
  misdirectedRequest: {
    name: 'Misdirected request',
    httpCode: 421
  },
  unprocessableEntity: {
    name: 'Unprocessable entity',
    httpCode: 422
  },
  locked: {
    name: 'Locked',
    httpCode: 423
  },
  failedDependency: {
    name: 'Failed dependency',
    httpCode: 424
  },
  upgradeRequired: {
    name: 'Upgrade required',
    httpCode: 426
  },
  preconditionRequired: {
    name: 'Precndition required',
    httpCode: 428
  },
  unavailableForLegalReasons: {
    name: 'Unavailable for legal reasons',
    httpCode: 451
  },
  internalRedirect: {
    name: 'Internal redirect',
    httpCode: 506
  },
  loopDetected: {
    name: 'Loop detected',
    httpCode: 508
  }
} as const

export default commonErrorsDictionary
