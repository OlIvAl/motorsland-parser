import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../Bootstrap/config/di/viewModel";
import { observer } from "mobx-react-lite";
import { DocumentListPage } from "./DocumentListPage";

export const EnginesPage: FC = observer(() => {
  const {
    list,
    loadingList,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
  } = useInjection(VIEW_MODEL.EngineList);

  return (
    <DocumentListPage
      title="Список выгрузок двигателей с сайта www.motorlandby.ru"
      list={list}
      loadingList={loadingList}
      newItemsCount={newItemsCount}
      createNewItemProcess={createNewItemProcess}
      createItem={createItem}
      deleteItem={deleteItem}
    />
  );
});
