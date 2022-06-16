import { FC } from "react";
import { useRouteNode } from "react-router5";
import { DocumentListPageContainer } from "./pages/DocumentListPageContainer";
import { useTranslation } from "react-i18next";

export const PageSelector: FC = () => {
  const { route } = useRouteNode("");
  const { t } = useTranslation();

  // ToDo: handle 404 error;

  switch (route.name) {
    case "uploading":
      return (
        <DocumentListPageContainer
          category={route.params.uploading}
          title={t(`titles:${route.params.uploading}`)}
        />
      );
    default:
      return null;
  }
};
