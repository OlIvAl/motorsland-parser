import React, { FC } from "react";
import { NavBar } from "./components/NavBar";
import { Box } from "@mui/material";
import { IUploadingListViewModel } from "../DataFlow/presentation/UploadingListViewModel/interfaces";
import { SideDrawer } from "./components/SideDrawer";

interface IProps extends Pick<IUploadingListViewModel, "uploadings"> {
  children: JSX.Element;
}

export const Layout: FC<IProps> = ({ children, uploadings }) => {
  return (
    <Box style={{ display: "flex" }} className="App">
      <SideDrawer categories={uploadings} />
      <NavBar />
      <Box style={{ marginTop: "70px", paddingLeft: "32px" }}>{children}</Box>
    </Box>
  );
};
