import { FC } from "react";
import ErrorNotifierComponent from "./ErrorNotifierComponent";
import { INotifierProps } from "./interfaces";

export const IntegrationErrorNotifier: FC<INotifierProps> = ({
  timestamp,
  description,
}) => {
  return (
    <ErrorNotifierComponent
      title="Интеграционная ошибка"
      description={description}
      timestamp={timestamp}
      testid="integration-error-notifier"
    />
  );
};
