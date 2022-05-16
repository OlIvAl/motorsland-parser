import React, { FC, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { CustomTable } from "../components/CustomTable";
import { LoadingButton } from "@mui/lab";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { IDocumentListViewModel } from "../../DataFlow/presentation/DocumentListViewModel/interfaces";

interface IProps extends Omit<IDocumentListViewModel, "getList"> {
  title: string;
}

export const DocumentListPage: FC<IProps> = ({
  title,
  list,
  loadingList,
  newItemsCount,
  createNewItemProcess,
  createItem,
  deleteItem,
}) => {
  const [deletedId, setDeletedId] = useState<ID>("");

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        {title}
      </Typography>

      {!list.length && !loadingList ? (
        <Typography variant="h6" gutterBottom component="div">
          Не создано ни одной выгрузки
        </Typography>
      ) : (
        <CustomTable
          loading={loadingList}
          createNewItemProcess={createNewItemProcess}
          documents={list}
          deletedId={deletedId}
          setDeletedId={setDeletedId}
        />
      )}
      <div>
        <LoadingButton
          loading={createNewItemProcess}
          disabled={loadingList || !!deletedId}
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={createItem}
        >
          Создать выгрузку
        </LoadingButton>

        {!loadingList && !createNewItemProcess ? (
          <Typography gutterBottom component="div">
            {newItemsCount} новых объявлений появилось со времени последней
            выгрузки
            <IconButton aria-label="delete">
              <AutorenewIcon />
            </IconButton>
          </Typography>
        ) : null}

        {loadingList && !createNewItemProcess ? <Skeleton width={550} /> : null}
      </div>
      <ConfirmDialog
        id={deletedId}
        close={() => setDeletedId("")}
        handler={deleteItem}
      />
    </Box>
  );
};
