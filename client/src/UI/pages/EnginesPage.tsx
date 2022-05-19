import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../DataFlow/config/viewModel";
import { observer } from "mobx-react-lite";
import { DocumentListPage } from "./DocumentListPage";

export const EnginesPage: FC = observer(() => {
  const {
    list,
    loadingList,
    loadingCount,
    newDocumentsCount,
    createNewDocumentProcess,
    createItem,
    deleteItem,
    updateNewDocumentsCount,
  } = useInjection(VIEW_MODEL.EngineList);

  return (
    <DocumentListPage
      title="Список выгрузок двигателей с сайта www.motorlandby.ru"
      list={list}
      loadingList={loadingList}
      loadingCount={loadingCount}
      newDocumentsCount={newDocumentsCount}
      createNewDocumentProcess={createNewDocumentProcess}
      createItem={createItem}
      deleteItem={deleteItem}
      updateNewDocumentsCount={updateNewDocumentsCount}
    />
  );
});
