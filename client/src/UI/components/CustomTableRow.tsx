import TableCell from "@mui/material/TableCell";
import { Button, Stack, TableRow } from "@mui/material";
import { CopyToClipboard } from "./CopyToClipboard";
import React, { FC } from "react";
import { IDocumentPresentationData } from "../../presentation/EngineListViewModel/interfaces";
import { DownloadBtn } from "./DownloadBtn";
import { Skeleton } from "@mui/lab";

export interface IProps extends IDocumentPresentationData {
  deletedLoading: boolean;
  setDeletedId(name: ID): void;
}

// ToDo: make skeletone;
export const CustomTableRow: FC<IProps> = ({
  id,
  name,
  createdOn,
  publicURL,
  deletedLoading,
  setDeletedId,
}) => {
  const deleteHandler = (): void => setDeletedId(id);

  return (
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      aria-disabled={true}
    >
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell>{createdOn}</TableCell>
      <TableCell width={625} height={70}>
        {!deletedLoading ? (
          <Stack spacing={2} direction="row">
            <CopyToClipboard publicURL={publicURL} />
            <DownloadBtn name={name} url={publicURL} />
            <Button variant="contained" color="error" onClick={deleteHandler}>
              Удалить
            </Button>
          </Stack>
        ) : (
          <Skeleton />
        )}
      </TableCell>
    </TableRow>
  );
};
