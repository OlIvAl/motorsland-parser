import TableCell from "@mui/material/TableCell";
import { Button, Link, Stack, TableRow } from "@mui/material";
import { CopyToClipboard } from "./CopyToClipboard";
import React, { FC } from "react";
import { IDocumentPresentationData } from "../../presentation/EngineListViewModel/interfaces";

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
  // const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteHandler = (): void => setDeletedId(id);
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {`${name}.xml`}
      </TableCell>
      <TableCell>{createdOn}</TableCell>
      <TableCell>
        <Stack spacing={2} direction="row">
          <CopyToClipboard publicURL={publicURL} />
          <Button
            component={Link}
            href={publicURL}
            download={`${name}.xml`}
            variant="contained"
            color="secondary"
          >
            Скачать документ
          </Button>
          <Button variant="contained" color="error" onClick={deleteHandler}>
            Удалить
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
