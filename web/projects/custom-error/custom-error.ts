export class CustomError extends Error {
  constructor(message?: string, public attachment?: any) {
    super(message);
    this.name = new.target.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
