import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { CustomTableRow } from "./CustomTableRow";
import TableContainer from "@mui/material/TableContainer";
import React, { FC } from "react";
import { SkeletonTableRow } from "./SkeletonTableRow";
import { IDocumentPresentationData } from "../../DataFlow/presentation/DocumentListViewModel/interfaces";

interface IProps {
  loading: boolean;
  createNewItemProcess: boolean;
  documents: IDocumentPresentationData[];
  deletedId: ID;
  setDeletedId(id: ID): void;
}

export const CustomTable: FC<IProps> = ({
  loading = false,
  createNewItemProcess = false,
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
          {!loading
            ? documents.map((document) => (
                <CustomTableRow
                  id={document.id}
                  name={document.name}
                  createdOn={document.createdOn}
                  deletedLoading={document.id === deletedId}
                  setDeletedId={setDeletedId}
                  createNewItemProcess={createNewItemProcess}
                  key={document.id}
                />
              ))
            : Array(5)
                .fill(1)
                .map((val, i) => <SkeletonTableRow key={val + i} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
