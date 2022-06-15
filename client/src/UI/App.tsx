import React, { FC, Fragment } from "react";
import { Layout } from "./Layout";
import { PageSelector } from "./PageSelector";
import useLastError from "./hooks/useLastError";
import ErrorNotifier from "./components/ErrorNotifier";
import { useInjection } from "brandi-react";
import { VIEW_MODEL } from "../DataFlow/config/viewModel";
import { CircleRounded } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

export const App: FC = observer(() => {
  const { loading, uploadings } = useInjection(VIEW_MODEL.UploadingList);
  const lastError = useLastError();

  return !loading ? (
    <Layout uploadings={uploadings}>
      <Fragment>
        <PageSelector />
        {lastError ? <ErrorNotifier error={lastError} /> : null}
      </Fragment>
    </Layout>
  ) : (
    <CircleRounded />
  );
});
