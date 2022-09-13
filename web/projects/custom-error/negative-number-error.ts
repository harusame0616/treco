import { ParameterError } from './parameter-error';

export class NegativeNumberError extends ParameterError {
  constructor(name: string) {
    super(`${name}は正の数値である必要があります。`);
  }
}
