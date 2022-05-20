import { FC } from "react";
import { useRouteNode } from "react-router5";
import { DocumentListPageContainer } from "./pages/DocumentListPageContainer";
import { useTranslation } from "react-i18next";

export const PageSelector: FC = () => {
  const { route } = useRouteNode("");
  const { t } = useTranslation();

  // ToDo: handle 404 error;

  return (
    <DocumentListPageContainer
      category={route.name}
      title={t(`titles:${route.name}`)}
    />
  );
};
