import TableCell from "@mui/material/TableCell";
import { Button, Stack, TableRow } from "@mui/material";
import { CopyToClipboard } from "./CopyToClipboard";
import React, { FC, useState } from "react";
import { IDocumentInfo } from "../interfaces";
import { LoadingButton } from "@mui/lab";

export interface IProps {
  document: IDocumentInfo;
  deleteCb: (name: string) => void;
  downloadCb: (name: string) => Promise<void>;
}

export const CustomTableRow: FC<IProps> = ({
  document,
  deleteCb,
  downloadCb,
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const deleteHandler = (): void => deleteCb(document.name);
  const downloadHandler = async (): Promise<void> => {
    setDownloadLoading(true);

    await downloadCb(document.name);

    setDownloadLoading(false);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {`${document.name}.xml`}
      </TableCell>
      <TableCell>
        {document.createdOn
          ? new Date(document.createdOn).toLocaleString("ru", {
              hour: "numeric",
              minute: "numeric",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </TableCell>
      <TableCell>
        <Stack spacing={2} direction="row">
          <CopyToClipboard name={document.name} />
          <LoadingButton
            variant="contained"
            color="secondary"
            loading={downloadLoading}
            onClick={downloadHandler}
          >
            Скачать документ
          </LoadingButton>
          <Button variant="contained" color="error" onClick={deleteHandler}>
            Удалить
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

//  onClick={() => getPublicUrl(document.name)}
