import React, { FC, Fragment } from "react";
import {
  CircularProgress,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";

interface IProps {
  loadingList: boolean;
  createNewItemProcess: boolean;
  loadingCount: boolean;
  newDocumentsCount: number;
  updateNewDocumentsCount(): void;
}

export const NewDocumentsInfo: FC<IProps> = ({
  loadingList,
  createNewItemProcess,
  loadingCount,
  newDocumentsCount,
  updateNewDocumentsCount,
}) => {
  return (
    <Fragment>
      {!loadingList && !createNewItemProcess ? (
        <Typography gutterBottom component="div">
          {newDocumentsCount} новых объявлений появилось со времени последней
          выгрузки
          <IconButton
            aria-label="delete"
            onClick={updateNewDocumentsCount}
            disabled={loadingCount}
          >
            {!loadingCount ? <AutorenewIcon /> : <CircularProgress size={24} />}
          </IconButton>
        </Typography>
      ) : null}

      {loadingList && !createNewItemProcess ? <Skeleton width={550} /> : null}
    </Fragment>
  );
};
