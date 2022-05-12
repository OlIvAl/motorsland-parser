import { createContext } from "react";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";

export const ErrorHandlerContext = createContext<ErrorCollector | null>(null);

if (process.env.NODE_ENV !== "production") {
  ErrorHandlerContext.displayName = "ErrorHandlerContext";
}
