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
  newItemsCount: number;
  updateNewItemsCount(): void;
}

export const NewDocumentsInfo: FC<IProps> = ({
  loadingList,
  createNewItemProcess,
  loadingCount,
  newItemsCount,
  updateNewItemsCount,
}) => {
  return (
    <Fragment>
      {!loadingList && !createNewItemProcess ? (
        <Typography gutterBottom component="div">
          {newItemsCount} новых объявлений появилось со времени последней
          выгрузки
          <IconButton
            aria-label="delete"
            onClick={updateNewItemsCount}
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
