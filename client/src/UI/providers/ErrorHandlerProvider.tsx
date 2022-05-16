import { FC } from "react";
import { ErrorCollector } from "../../ErrorCollector/ErrorCollector";
import { ErrorHandlerContext } from "../contexts";

interface IProps {
  handler: ErrorCollector;
  children: JSX.Element;
}

export const ErrorHandlerProvider: FC<IProps> = ({ handler, children }) => (
  <ErrorHandlerContext.Provider value={handler}>
    {children}
  </ErrorHandlerContext.Provider>
);
