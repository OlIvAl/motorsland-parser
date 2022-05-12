import ReactDOM from "react-dom/client";
import React from "react";
import { CssBaseline } from "@mui/material";
import { App } from "./App";
import { Router } from "router5";
import { Container } from "brandi";
import { ErrorCollector } from "../libs/ErrorCollector/ErrorCollector";
import { RouterProvider } from "react-router5";
import { ErrorHandlerProvider } from "./providers/ErrorHandlerProvider";
import { ContainerProvider } from "brandi-react";

export function renderApp(
  router: Router,
  container: Container,
  errorCollector: ErrorCollector
): void {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}>
        {/*
        // @ts-ignore */}
        <ContainerProvider container={container}>
          <ErrorHandlerProvider handler={errorCollector}>
            <div>
              <CssBaseline />
              <App />
            </div>
          </ErrorHandlerProvider>
        </ContainerProvider>
      </RouterProvider>
    </React.StrictMode>
  );
}
