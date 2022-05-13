import { FC } from "react";
import { useRouteNode } from "react-router5";
import { EnginesPage } from "./pages/EnginesPage";
import { TransmissionsPage } from "./pages/TransmissionsPage";

export const PageSelector: FC = () => {
  const { route } = useRouteNode("");

  switch (route.name) {
    case "engines":
      return <EnginesPage />;
    case "transmissions":
      return <TransmissionsPage />;
    default:
      return null;
  }
};
