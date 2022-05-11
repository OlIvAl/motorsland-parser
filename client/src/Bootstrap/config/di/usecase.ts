import { DependencyContainer } from "tsyringe";
import { GetEngineListUseCase } from "../../../domain/usecase/Engine/GetEngineListUseCase";
import { CreateEngineUseCase } from "../../../domain/usecase/Engine/CreateEngineUseCase";
import { DeleteEngineUseCase } from "../../../domain/usecase/Engine/DeleteEngineUseCase";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../../domain/usecase/Engine/interfaces";

export const USE_CASE = {
  GetEngineList: Symbol.for("GetEngineListUseCase"),
  CreateEngine: Symbol.for("CreateEngineUseCase"),
  DeleteEngine: Symbol.for("DeleteEngineUseCase"),
};

export function getContainerWithUseCases(
  container: DependencyContainer
): DependencyContainer {
  container.register<IGetListUseCase>(
    USE_CASE.GetEngineList,
    GetEngineListUseCase
  );
  container.register<ICreateItemUseCase>(
    USE_CASE.CreateEngine,
    CreateEngineUseCase
  );
  container.register<IDeleteItemUseCase>(
    USE_CASE.DeleteEngine,
    DeleteEngineUseCase
  );

  return container;
}
