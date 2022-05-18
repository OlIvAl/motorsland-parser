import { FC, memo } from "react";
import { Alert, AlertColor, AlertTitle, Snackbar } from "@mui/material";
import { TransitionComponent } from "./TransitionComponent";

interface IProps {
  open: boolean;
  title: string;
  description?: string;
  onCloseHandler: () => void;
  severity?: AlertColor;
  testid?: string;
  variant?: "standard" | "filled" | "outlined";
  additionalData?: Record<string, any>;
}
/**
 * Выводит всплывающее сообщение на стрнице.
 */
const BaseNotifier: FC<IProps> = ({
  open,
  title,
  description,
  onCloseHandler,
  severity = "error",
  testid,
  variant = "filled",
}) => {
  const handleClose = (): void => {
    onCloseHandler();
  };

  return (
    <Snackbar
      TransitionComponent={TransitionComponent}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={handleClose}
      data-testid={testid}
    >
      <Alert onClose={handleClose} severity={severity} variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Snackbar>
  );
};

export default memo(
  BaseNotifier,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
