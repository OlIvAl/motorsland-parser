import { memo, FC } from "react";
import { useTranslation } from "react-i18next";
import { ICustomError } from "../../../ErrorCollector/errors/interfaces";
import { ServerError } from "../../../ErrorCollector/errors/ServerError";
import { IntegrationError } from "../../../ErrorCollector/errors/IntegrationError";
import { IntegrationErrorNotifier } from "./IntegrationErrorNotifier";
import { ServerErrorNotifier } from "./ServerErrorNotifier";

interface IProps {
  error: ICustomError;
}

const ErrorNotifier: FC<IProps> = ({ error }) => {
  const { t } = useTranslation();

  if (error instanceof IntegrationError) {
    return (
      <IntegrationErrorNotifier
        description={t(`errors:${error.message}`)}
        timestamp={error.timestamp}
      />
    );
  }
  if (error instanceof ServerError) {
    return (
      <ServerErrorNotifier
        description={error.message}
        timestamp={error.timestamp}
      />
    );
  }

  return null;
};

export default memo(
  ErrorNotifier,
  (prevProps, nextProps) =>
    prevProps.error?.timestamp === nextProps.error?.timestamp
);
