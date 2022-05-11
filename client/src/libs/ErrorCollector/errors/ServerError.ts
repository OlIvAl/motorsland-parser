import { CustomError } from './CustomError';
import { IServerError } from './interfaces';

export class ServerError extends CustomError implements IServerError {
  description: string;
  code: number;

  constructor(code: number, statusText: string, description: string) {
    super(`${code} - ${statusText}. ${description}`);
    this.name = 'ServerError';

    this.code = code;

    this.title = `${code} - ${statusText}`;
    this.description = description;

    const err = new ErrorEvent('error', {
      error: this,
      message: this.message
    });

    dispatchEvent(err);
  }
}
