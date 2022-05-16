import { ICustomError } from './interfaces';

export abstract class CustomError extends Error implements ICustomError {
  title = '';
  description = '';
  timestamp: number = 0;
  meta: Record<string, any> = {};

  protected constructor(message: string) {
    super(message);

    this.timestamp = Date.parse(Date());

    this.name = 'CustomError';
  }

  setMeta(meta: Partial<Record<string, any>>): void {
    this.meta = { ...this.meta, ...meta };
  }
}
