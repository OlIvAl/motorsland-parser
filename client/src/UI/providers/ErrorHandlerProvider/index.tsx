import { FC } from "react";
import { ErrorCollector } from "../../../libs/ErrorCollector/ErrorCollector";
import { ErrorHandlerContext } from "../../contexts";

interface IProps {
  handler: ErrorCollector;
  children: JSX.Element;
}

const ErrorHandlerProvider: FC<IProps> = ({ handler, children }) => (
  <ErrorHandlerContext.Provider value={handler}>
    {children}
  </ErrorHandlerContext.Provider>
);

export default ErrorHandlerProvider;
