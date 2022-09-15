import { ParameterError } from './parameter-error';

export class FormatError extends ParameterError {
  constructor(name: string) {
    super(`${name}の形式が不正です`);
  }
}
