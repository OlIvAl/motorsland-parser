import { ICustomError } from "./interfaces";

export abstract class CustomError extends Error implements ICustomError {
  timestamp: number = 0;

  protected constructor(message: string) {
    super(message);

    this.timestamp = Date.parse(Date());

    this.name = "CustomError";
  }
}
