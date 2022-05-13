import React, { FC } from "react";
import { NavBar } from "./components/NavBar";
import { Container } from "@mui/material";

export const Layout: FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <Container maxWidth="lg" className="App">
      <NavBar />
      <Container>{children}</Container>
    </Container>
  );
};
