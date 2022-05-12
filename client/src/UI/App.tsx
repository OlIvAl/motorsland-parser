import React, { FC, useState } from "react";
import { Container, Typography } from "@mui/material";
import { LoadingButton, Skeleton } from "@mui/lab";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CustomTable } from "./components/CustomTable";
import { observer, Observer } from "mobx-react-lite";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../Bootstrap/config/di/viewModel";

export const App: FC = observer(() => {
  const [deletedId, setDeletedId] = useState<ID>("");

  const {
    list,
    loadingList,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
  } = useInjection(VIEW_MODEL.EngineList);

  return (
    <Observer>
      {() => (
        <Container maxWidth="lg" className="App">
          <Typography variant="h4" gutterBottom component="div">
            Список выгрузок с сайта www.motorlandby.ru
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
        </Container>
      )}
    </Observer>
  );
});
