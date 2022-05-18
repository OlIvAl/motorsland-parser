import { CustomError } from "./CustomError";
import { IServerError } from "./interfaces";

export class ServerError extends CustomError implements IServerError {
  constructor(code: number, statusText: string) {
    super(`${code} - ${statusText}`);
    this.name = "ServerError";

    const err = new ErrorEvent("error", {
      error: this,
      message: this.message,
    });

    dispatchEvent(err);
  }
}
