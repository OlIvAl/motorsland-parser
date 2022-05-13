import React, { FC } from "react";
import { Layout } from "./Layout";
import { PageSelector } from "./PageSelector";

export const App: FC = () => {
  return (
    <Layout>
      <PageSelector />
    </Layout>
  );
};
