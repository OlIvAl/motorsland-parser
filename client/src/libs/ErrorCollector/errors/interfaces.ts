export interface ICustomError extends Error {
  timestamp: number;

  title: string;
  description: string;

  meta: Record<string, any>;

  setMeta: (meta: Partial<Record<string, any>>) => void;
}

export interface IServerError extends ICustomError {
  code: number;
}

/* export interface IIntegrationError extends ICustomError {
  id: ID;
  code: string;
  details: object;
  meta: IUserInfo;
} */
