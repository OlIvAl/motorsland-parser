import { FC, useState, useEffect } from "react";
import BaseNotifier from "../BaseNotifier";

interface IProps {
  title: string;
  description?: string;
  timestamp: number;
  testid: string;
}

const ErrorNotifierComponent: FC<IProps> = ({
  title,
  description,
  timestamp,
  testid,
}) => {
  const [open, setOpen] = useState(true);

  const onCloseHandler = (): void => setOpen(false);

  useEffect(() => {
    setOpen(true);
    return (): void => setOpen(false);
  }, [timestamp]);

  return (
    <BaseNotifier
      open={open}
      title={title}
      description={description}
      onCloseHandler={onCloseHandler}
      testid={testid}
    />
  );
};

export default ErrorNotifierComponent;
