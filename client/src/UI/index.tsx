import ReactDOM from "react-dom/client";
import React from "react";
import { CssBaseline } from "@mui/material";
import { App } from "./App";
import { Router } from "router5";
import { Container } from "brandi";
import { ErrorCollector } from "../ErrorCollector/ErrorCollector";
import { RouterProvider } from "react-router5";
import { ErrorHandlerProvider } from "./providers/ErrorHandlerProvider";
import { ContainerProvider } from "brandi-react";
import { i18n } from "i18next";
import { I18nextProvider } from "react-i18next";

export function renderApp(
  router: Router,
  i18next: i18n,
  container: Container,
  errorCollector: ErrorCollector
): void {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}>
        <I18nextProvider i18n={i18next}>
          <ContainerProvider container={container}>
            <ErrorHandlerProvider handler={errorCollector}>
              <div>
                <CssBaseline />
                <App />
              </div>
            </ErrorHandlerProvider>
          </ContainerProvider>
        </I18nextProvider>
      </RouterProvider>
    </React.StrictMode>
  );
}
