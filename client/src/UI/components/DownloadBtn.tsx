import { FC } from "react";
import { Button } from "@mui/material";
import { API_ROOT } from "../../Bootstrap/constants";

interface IProps {
  link: string;
  name: string;
  type: "CSV" | "XML";
}

export const DownloadBtn: FC<IProps> = ({ link, name, type }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      component="a"
      href={API_ROOT + link}
      download={name}
    >
      Скачать {type}
    </Button>
  );
};
