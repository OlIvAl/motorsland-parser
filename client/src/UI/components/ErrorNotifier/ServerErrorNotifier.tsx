import { FC } from "react";
import ErrorNotifierComponent from "./ErrorNotifierComponent";
import { INotifierProps } from "./interfaces";

export const ServerErrorNotifier: FC<INotifierProps> = ({
  description,
  timestamp,
}) => {
  return (
    <ErrorNotifierComponent
      title="Серверная ошибка"
      description={description}
      timestamp={timestamp}
      testid="server-error-notifier"
    />
  );
};
