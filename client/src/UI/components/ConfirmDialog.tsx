import React, { FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IProps {
  id: ID;
  close: () => void;
  handler: (id: ID) => Promise<void>;
}

export const ConfirmDialog: FC<IProps> = ({ id, close, handler }) => {
  const okHandler = () => {
    handler(id);
    close();
  };
  const closeHandler = () => close();

  return (
    <Dialog
      open={!!id}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Вы точно хотите удалить этот документ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Удаление документа повлечет удаление так же и всех фото, относящихся к
          документу
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={closeHandler}>
          Отменить
        </Button>
        <Button onClick={okHandler} color="error">
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
