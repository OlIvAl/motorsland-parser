import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../DataFlow/config/viewModel";
import { DocumentListPage } from "./DocumentListPage";
import { observer } from "mobx-react-lite";

export const TransmissionsPage: FC = observer(() => {
  const {
    list,
    loadingList,
    loadingCount,
    newDocumentsCount,
    createNewDocumentProcess,
    createItem,
    deleteItem,
    updateNewDocumentsCount,
  } = useInjection(VIEW_MODEL.TransmissionList);

  return (
    <DocumentListPage
      title="Список выгрузок АКПП / МКПП с сайта www.motorlandby.ru"
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
