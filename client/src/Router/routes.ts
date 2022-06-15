import { Route, Router } from "router5";
import { RouterDependencies } from "../index";
import { Params } from "router5/dist/types/base";
import { VIEW_MODEL } from "../DataFlow/config/viewModel";
import { Container } from "brandi";

export const routes: (
  | Route
  | {
      title: string;
      onEnter: (
        router: Router<RouterDependencies>,
        toStateParams: Params,
        fromStateParams: Params
      ) => void;
    }
)[] = [
  {
    name: "home",
    path: "/",
  },
  {
    title: "",
    name: "uploading",
    path: "/:uploading",
    onEnter: (router: Router<RouterDependencies>, params: Params): void => {
      const container: Container = router.getDependencies().container;
      const vm = container.get(VIEW_MODEL.DocumentList);

      vm.getList(params.uploading);
    },
  },
];
