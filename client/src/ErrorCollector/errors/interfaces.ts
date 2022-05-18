export interface ICustomError extends Error {
  timestamp: number;
  message: string;
}

export interface IServerError extends ICustomError {}

export interface IIntegrationError extends ICustomError {
  id: ID;
  code: string;
  meta?: Record<string, any>;
}
