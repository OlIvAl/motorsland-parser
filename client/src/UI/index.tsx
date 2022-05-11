import ReactDOM from "react-dom/client";
import React from "react";
import { CssBaseline } from "@mui/material";
import App from "./App";
import { Router } from "router5";
import { DependencyContainer } from "tsyringe";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";
import { RouterProvider } from "react-router5";
import ErrorHandlerProvider from "./providers/ErrorHandlerProvider";
import DIContainerProvider from "./providers/DIContainerProvider";

export function renderApp(
  router: Router,
  container: DependencyContainer,
  errorCollector: ErrorCollector
): void {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}>
        <ErrorHandlerProvider handler={errorCollector}>
          <DIContainerProvider container={container}>
            <div>
              <CssBaseline />
              <App />
            </div>
          </DIContainerProvider>
        </ErrorHandlerProvider>
      </RouterProvider>
    </React.StrictMode>
  );
}
