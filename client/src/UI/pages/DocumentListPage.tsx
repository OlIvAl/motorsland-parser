import React, { FC, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { CustomTable } from "../components/CustomTable";
import { LoadingButton } from "@mui/lab";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { IDocumentListViewModel } from "../../presentation/DocumentListViewModel/interfaces";

interface IProps extends Omit<IDocumentListViewModel, "getList"> {}

export const DocumentListPage: FC<IProps> = ({
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
        Список выгрузок двигателей с сайта www.motorlandby.ru
      </Typography>

      {!list.length && !loadingList ? (
        <Typography variant="h6" gutterBottom component="div">
          Не создано ни одной выгрузки
        </Typography>
      ) : (
        <CustomTable
          documents={list}
          loading={loadingList}
          deletedId={deletedId}
          setDeletedId={setDeletedId}
        />
      )}
      <div>
        <LoadingButton
          loading={createNewItemProcess}
          disabled={loadingList}
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={createItem}
        >
          Создать выгрузку
        </LoadingButton>
        {!loadingList ? (
          <Typography gutterBottom component="div">
            {newItemsCount} новых объявлений появилось со времени последней
            выгрузки
          </Typography>
        ) : (
          <Skeleton width={550} />
        )}
      </div>
      <ConfirmDialog
        id={deletedId}
        close={() => setDeletedId("")}
        handler={deleteItem}
      />
    </Box>
  );
};
