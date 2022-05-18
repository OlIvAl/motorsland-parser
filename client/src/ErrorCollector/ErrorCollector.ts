import { action, computed, observable, makeObservable } from "mobx";
import {
  ICustomError,
  IIntegrationError,
  IServerError,
} from "./errors/interfaces";
import { ServerError } from "./errors/ServerError";
import EventEmitter from "eventemitter3";
import { IntegrationError } from "./errors/IntegrationError";

// ToDo: убрать mobx, make like lightbox

export enum GlobalErrorCollectorEvents {
  onSetError = "onSetError",
  onSetServerError = "onSetServerError",
  onSetIntegrationError = "onSetIntegrationError",
}

export class ErrorCollector {
  constructor() {
    makeObservable<ErrorCollector, "_errors">(this, {
      integrationErrors: computed,
      serverErrors: computed,
      errors: computed,
      _errors: observable,
      setError: action.bound,
      findIntegrationError: action.bound,
      dispose: action.bound,
    });
  }

  get integrationErrors(): IIntegrationError[] {
    return (this._errors as IIntegrationError[]).filter(
      (error) => error instanceof IntegrationError
    );
  }

  get serverErrors(): IServerError[] {
    return (this._errors as IServerError[]).filter(
      (error): boolean => error instanceof ServerError
    );
  }

  get errors(): ICustomError[] {
    return this._errors;
  }

  private _errors: ICustomError[] = [];

  private eventEmitter: EventEmitter = new EventEmitter();

  setError<E extends ICustomError>(error: E): void {
    this._errors = [error, ...this._errors];
    this.eventEmitter.emit(GlobalErrorCollectorEvents.onSetError, error);

    if (error instanceof IntegrationError) {
      this.eventEmitter.emit(
        GlobalErrorCollectorEvents.onSetIntegrationError,
        error
      );
    }
    if (error instanceof ServerError) {
      this.eventEmitter.emit(
        GlobalErrorCollectorEvents.onSetServerError,
        error
      );
    }
  }

  findIntegrationError(
    code?: IIntegrationError["code"]
  ): IntegrationError | undefined {
    if (!code) {
      return this.integrationErrors[0];
    }
    return this.integrationErrors.find((error) => error.code === code);
  }

  dispose(): void {
    this._errors = [];
  }

  on(
    event: GlobalErrorCollectorEvents,
    cb: (err: ICustomError) => Promise<void>
  ): void {
    this.eventEmitter.on(event, cb);
  }
}
