import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../Bootstrap/config/di/viewModel";
import { DocumentListPage } from "./DocumentListPage";

export const TransmissionsPage: FC = () => {
  const {
    list,
    loadingList,
    loadingCount,
    newItemsCount,
    createNewItemProcess,
    createItem,
    deleteItem,
    updateNewItemsCount,
  } = useInjection(VIEW_MODEL.TransmissionList);

  return (
    <DocumentListPage
      title="Список выгрузок АКПП / МКПП с сайта www.motorlandby.ru"
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
};
