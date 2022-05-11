import { Route, Router } from "router5";
import { RouterDependencies } from "../../index";
import { Params } from "router5/dist/types/base";
import { DependencyContainer } from "tsyringe";
import { IDocumentListViewModel } from "../../presentation/EngineListViewModel/interfaces";
import { VIEW_MODEL } from "./di/viewModel";

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
      const container: DependencyContainer = router.getDependencies().container;
      const vm = container.resolve<IDocumentListViewModel>(
        VIEW_MODEL.EngineList
      );

      vm.getList();
    },
  },
  {
    title: "АКПП / МКПП",
    name: "transmissions",
    path: "/transmissions",
  },
];
