import { ParameterError } from './parameter-error';

export class TextOverflowError extends ParameterError {
  constructor(name: string, maxLength: number) {
    super(`${name}は${maxLength}文字以内である必要があります。`);
  }
}
