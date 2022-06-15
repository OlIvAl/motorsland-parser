import React, { FC } from "react";
import { NavBar } from "./components/NavBar";
import { Container } from "@mui/material";
import { IUploadingListViewModel } from "../DataFlow/presentation/UploadingListViewModel/interfaces";
import { SideDrawer } from "./components/SideDrawer";

interface IProps extends Pick<IUploadingListViewModel, "uploadings"> {
  children: JSX.Element;
}

export const Layout: FC<IProps> = ({ children, uploadings }) => {
  return (
    <Container maxWidth="lg" className="App">
      <SideDrawer categories={uploadings} />
      <NavBar />
      <Container>{children}</Container>
    </Container>
  );
};
