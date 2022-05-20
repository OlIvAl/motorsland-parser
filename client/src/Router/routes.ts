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
    forwardTo: "engines",
  },
  {
    title: "Двигатели",
    name: "engines",
    path: "/engines",
    onEnter: (router: Router<RouterDependencies>): void => {
      const container: Container = router.getDependencies().container;
      const vm = container.get(VIEW_MODEL.DocumentList);

      vm.getList("engines");
    },
  },
  {
    title: "АКПП / МКПП",
    name: "transmissions",
    path: "/transmissions",
    onEnter: (router: Router<RouterDependencies>): void => {
      const container: Container = router.getDependencies().container;
      const vm = container.get(VIEW_MODEL.DocumentList);

      vm.getList("transmissions");
    },
  },
];
