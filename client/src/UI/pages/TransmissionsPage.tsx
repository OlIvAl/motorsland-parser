import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../Bootstrap/config/di/viewModel";
import { DocumentListPage } from "./DocumentListPage";

export const TransmissionsPage: FC = () => {
  const {
    list,
    loadingList,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
  } = useInjection(VIEW_MODEL.TransmissionList);

  return (
    <DocumentListPage
      list={list}
      loadingList={loadingList}
      newItemsCount={newItemsCount}
      createNewItemProcess={createNewItemProcess}
      createItem={createItem}
      deleteItem={deleteItem}
    />
  );
};
