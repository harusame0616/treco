import { ParameterError } from './parameter-error';

export class RequireError extends ParameterError {
  constructor(name: string) {
    super(`${name}は必須です。`);
  }
}
