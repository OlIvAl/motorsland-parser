import { IIntegrationError } from "./interfaces";
import { CustomError } from "./CustomError";
import { HttpError } from "http-json-errors";

export class IntegrationError extends CustomError implements IIntegrationError {
  id: ID;
  code: string;
  meta?: Record<string, any>;

  constructor(errorBody: HttpError) {
    super(errorBody.message);
    this.name = "IntegrationError";

    this.id = this.timestamp;
    this.code = errorBody.message;

    this.meta = errorBody.body;

    const err = new ErrorEvent("error", {
      error: this,
      message: this.message,
    });

    dispatchEvent(err);
  }
}
