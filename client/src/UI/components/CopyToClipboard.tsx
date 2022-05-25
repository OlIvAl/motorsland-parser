import React, { FC, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { API_ROOT } from "../../Bootstrap/constants";

interface IProps {
  link: string;
}

export const CopyToClipboard: FC<IProps> = ({ link = "" }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>("");

  const copyToClipBoard = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(API_ROOT + url);

      setOpen(true);
      setCopySuccess("Ссылка скопирована!");
    } catch (err) {
      setOpen(true);
      setCopySuccess("Ошибка при копировании!");
    }
  };

  const copyToClipBoardHandler = (): Promise<void> => copyToClipBoard(link);

  return (
    <Tooltip
      open={open}
      title={copySuccess}
      leaveDelay={1500}
      onClose={() => setOpen(false)}
    >
      <Button variant="contained" onClick={copyToClipBoardHandler}>
        Копировать ссылку
      </Button>
    </Tooltip>
  );
};
