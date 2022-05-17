import React, { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { CustomTable } from "../components/CustomTable";
import { LoadingButton } from "@mui/lab";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { IDocumentListViewModel } from "../../DataFlow/presentation/DocumentListViewModel/interfaces";
import { NewDocumentsInfo } from "../components/NewDocumentsInfo";

interface IProps extends Omit<IDocumentListViewModel, "getList"> {
  title: string;
}

export const DocumentListPage: FC<IProps> = ({
  title,
  list,
  loadingList,
  loadingCount,
  newItemsCount,
  createNewItemProcess,
  createItem,
  deleteItem,
  updateNewItemsCount,
}) => {
  const [deletedId, setDeletedId] = useState<ID>("");

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        {title}
      </Typography>

      {createNewItemProcess ? (
        <Typography variant="h5" gutterBottom component="div">
          Происходит выгрузка товаров. <br />
          До ее завершения функционал ограничен
        </Typography>
      ) : null}

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
          disabled={loadingList || !!deletedId || loadingCount}
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={createItem}
        >
          Создать выгрузку
        </LoadingButton>

        <NewDocumentsInfo
          loadingList={loadingList}
          createNewItemProcess={createNewItemProcess}
          loadingCount={loadingCount}
          newItemsCount={newItemsCount}
          updateNewItemsCount={updateNewItemsCount}
        />
      </div>
      <ConfirmDialog
        id={deletedId}
        close={() => setDeletedId("")}
        handler={deleteItem}
      />
    </Box>
  );
};
