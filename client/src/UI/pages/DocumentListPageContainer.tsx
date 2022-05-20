import React, { FC } from "react";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../../DataFlow/config/viewModel";
import { observer } from "mobx-react-lite";
import { DocumentListPage } from "./DocumentListPage";

interface IProps {
  category: string;
  title: string;
}

export const DocumentListPageContainer: FC<IProps> = observer(
  ({ category, title }) => {
    const {
      list,
      loadingList,
      loadingCount,
      newDocumentsCount,
      createNewDocumentProcess,
      createItem,
      deleteItem,
      updateNewDocumentsCount,
    } = useInjection(VIEW_MODEL.DocumentList);

    return (
      <DocumentListPage
        category={category}
        title={title}
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
  }
);
