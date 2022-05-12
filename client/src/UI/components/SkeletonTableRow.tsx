import React, { FC } from "react";
import TableCell from "@mui/material/TableCell";
import { Skeleton } from "@mui/lab";
import TableRow from "@mui/material/TableRow";

export const SkeletonTableRow: FC = () => (
  <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
    <TableCell width={340} component="th" scope="row">
      <Skeleton />
    </TableCell>
    <TableCell width={185}>
      <Skeleton />
    </TableCell>
    <TableCell width={625}>
      <Skeleton />
    </TableCell>
  </TableRow>
);
