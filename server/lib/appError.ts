type HttpCode = 200 | 300 | 404 | 500;
const commonErrorsDict: {resourceNotFound: string, notFound: HttpCode} = {
  resourceNotFound: 'Resource not found',
  notFound: 404,
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode: HttpCode, description: string, isOperational: boolean) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
