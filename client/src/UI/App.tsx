import React, { FC, Fragment } from "react";
import { Layout } from "./Layout";
import { PageSelector } from "./PageSelector";
import useLastError from "./hooks/useLastError";
import ErrorNotifier from "./components/ErrorNotifier";

export const App: FC = () => {
  const lastError = useLastError();

  return (
    <Layout>
      <Fragment>
        <PageSelector />
        {lastError ? <ErrorNotifier error={lastError} /> : null}
      </Fragment>
    </Layout>
  );
};
