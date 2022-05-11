import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { CustomTableRow } from "./CustomTableRow";
import TableContainer from "@mui/material/TableContainer";
import React, { FC } from "react";
import { IDocumentPresentationData } from "../../presentation/EngineListViewModel/interfaces";

interface IProps {
  loading: boolean;
  documents: IDocumentPresentationData[];
  deletedId: ID;
  setDeletedId(id: ID): void;
}

export const CustomTable: FC<IProps> = ({
  loading = false,
  documents = [],
  deletedId,
  setDeletedId,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Дата создания</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((document) => (
            <CustomTableRow
              id={document.id}
              name={document.name}
              createdOn={document.createdOn}
              publicURL={document.publicURL}
              deletedLoading={document.id === deletedId}
              setDeletedId={setDeletedId}
              key={document.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
