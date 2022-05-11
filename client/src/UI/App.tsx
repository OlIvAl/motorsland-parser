import React, { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CustomTable } from "./components/CustomTable";
import useViewModel from "./hooks/useViewModel";
import { VIEW_MODEL } from "../Bootstrap/config/di/viewModel";
import { IDocumentListViewModel } from "../presentation/EngineListViewModel/interfaces";

function App() {
  const [deletedId, setDeletedId] = useState<ID>("");

  const {
    list,
    loadingList,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
  } = useViewModel<IDocumentListViewModel>(VIEW_MODEL.EngineList);

  return (
    <Container maxWidth="lg" className="App">
      <Typography variant="h4" gutterBottom component="div">
        Список выгрузок с сайта www.motorlandby.ru
      </Typography>
      {list.length ? (
        <CustomTable
          documents={list}
          loading={loadingList}
          deletedId={deletedId}
          setDeletedId={setDeletedId}
        />
      ) : (
        <Typography variant="h6" gutterBottom component="div">
          Не создано ни одной выгрузки
        </Typography>
      )}

      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={createItem}
        >
          Создать выгрузку
        </Button>
        <Typography gutterBottom component="div">
          {newItemsCount} новых объявлений появилось со времени последней
          выгрузки
        </Typography>
      </div>

      <ConfirmDialog
        id={deletedId}
        close={() => setDeletedId("")}
        handler={deleteItem}
      />
    </Container>
  );
}

export default App;
