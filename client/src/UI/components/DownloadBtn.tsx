import { FC } from "react";
import { Button } from "@mui/material";

interface IProps {
  url: string;
  name: string;
}

export const DownloadBtn: FC<IProps> = ({ url, name }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      component="a"
      href={url}
      download={name}
    >
      Скачать документ
    </Button>
  );
};
