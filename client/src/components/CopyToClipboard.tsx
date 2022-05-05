import React, { FC, useState } from "react";
import { Tooltip } from "@mui/material";
import { getPublicUrl } from "../handles";
import { LoadingButton } from "@mui/lab";

interface IProps {
  name: string;
}

export const CopyToClipboard: FC<IProps> = ({ name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipBoard = async (documentName: string): Promise<void> => {
    try {
      setLoading(true);

      const publicUrl = await getPublicUrl(documentName);
      await navigator.clipboard.writeText(publicUrl);

      setOpen(true);
      setCopySuccess("Ссылка скопирована!");
    } catch (err) {
      setOpen(true);
      setCopySuccess("Ошибка при копировании!");
    } finally {
      setLoading(false);
    }
  };

  // ToDo: использовать LoadingButton
  return (
    <Tooltip
      open={open}
      title={copySuccess}
      leaveDelay={1500}
      onClose={() => setOpen(false)}
    >
      <LoadingButton
        loading={loading}
        variant="contained"
        onClick={() => copyToClipBoard(name)}
      >
        Копировать ссылку
      </LoadingButton>
    </Tooltip>
  );
};
