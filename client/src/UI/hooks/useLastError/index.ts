import { useContext, useState, useEffect } from "react";
import { reaction } from "mobx";
import { ICustomError } from "../../../libs/ErrorCollector/errors/interfaces";
import { ErrorHandlerContext } from "../../contexts";

/**
 * Возвращает последнюю ошибку.
 */
export default function useLastError(): ICustomError | null {
  const errorCollector = useContext(ErrorHandlerContext);

  const [lastError, setLastError] = useState<ICustomError | null>(
    (errorCollector &&
      errorCollector.errors.length &&
      errorCollector.errors[0]) ||
      null
  );

  useEffect(
    () =>
      reaction(
        () => errorCollector && errorCollector.errors.length,
        () => {
          setLastError(
            errorCollector && errorCollector.errors.length
              ? errorCollector.errors[0]
              : null
          );
        }
      ),
    [errorCollector]
  );

  return lastError;
}
