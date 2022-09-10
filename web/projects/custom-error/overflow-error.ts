import { ParameterError } from './parameter-error';

export class OverflowError extends ParameterError {
  constructor(name: string, maxLength: number) {
    super(`${name}は最大${maxLength}です。`);
  }
}
