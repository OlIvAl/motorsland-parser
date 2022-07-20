import TableCell from "@mui/material/TableCell";
import { Button, Stack, TableRow } from "@mui/material";
import React, { FC } from "react";
import { DownloadBtn } from "./DownloadBtn";
import { IDocumentPresentationData } from "../../DataFlow/presentation/DocumentListViewModel/interfaces";

export interface IProps extends IDocumentPresentationData {
  setDeletedId(name: ID): void;
  createNewItemProcess: boolean;
}

export const CustomTableRow: FC<IProps> = ({
  id,
  name,
  createdOn,
  setDeletedId,
  createNewItemProcess,
}) => {
  const deleteHandler = (): void => setDeletedId(id);

  return (
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      aria-disabled={true}
    >
      <TableCell>{name}</TableCell>
      <TableCell>{createdOn}</TableCell>
      <TableCell height={70}>
        <Stack spacing={2} direction="row">
          <DownloadBtn name={name} link={`/download/${name}.xml`} type="XML" />
          <DownloadBtn name={name} link={`/download/${name}.csv`} type="CSV" />
          <Button
            variant="contained"
            color="error"
            onClick={deleteHandler}
            disabled={createNewItemProcess}
          >
            Удалить
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
