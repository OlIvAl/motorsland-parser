import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../Bootstrap/config/di/viewModel";
import { observer } from "mobx-react-lite";
import { DocumentListPage } from "./DocumentListPage";

export const EnginesPage: FC = observer(() => {
  const {
    list,
    loadingList,
    loadingCount,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
    updateNewItemsCount,
  } = useInjection(VIEW_MODEL.EngineList);

  return (
    <DocumentListPage
      title="Список выгрузок двигателей с сайта www.motorlandby.ru"
      list={list}
      loadingList={loadingList}
      loadingCount={loadingCount}
      newItemsCount={newItemsCount}
      createNewItemProcess={createNewItemProcess}
      createItem={createItem}
      deleteItem={deleteItem}
      updateNewItemsCount={updateNewItemsCount}
    />
  );
});
