import { createStyles, makeStyles } from "@mui/material";

export const useStyles = makeStyles(() =>
  createStyles({
    alert: {
      alignItems: "flex-start",
    },
    errorMessage: {
      position: "relative",
      fontWeight: "normal",
    },
    errorHelp: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    underlined: {
      textDecoration: "underline",
    },
    paper: {
      display: "none",
    },
    preStyle: {
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    },
  })
);
