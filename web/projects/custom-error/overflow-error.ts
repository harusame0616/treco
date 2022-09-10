import { ParameterError } from './parameter-error';

export class OverflowError extends ParameterError {
  constructor(name: string, maxLength: number) {
    super(`${name}は${maxLength}以内である必要があります。`);
  }
}
