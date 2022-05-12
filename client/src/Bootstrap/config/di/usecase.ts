import { GetEngineListUseCase } from "../../../domain/usecase/Engine/GetEngineListUseCase";
import { CreateEngineUseCase } from "../../../domain/usecase/Engine/CreateEngineUseCase";
import { DeleteEngineUseCase } from "../../../domain/usecase/Engine/DeleteEngineUseCase";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../../domain/usecase/Engine/interfaces";
import { Container, token } from "brandi";

export const USE_CASE = {
  GetEngineList: token<IGetListUseCase>("GetEngineListUseCase"),
  CreateEngine: token<ICreateItemUseCase>("CreateEngineUseCase"),
  DeleteEngine: token<IDeleteItemUseCase>("DeleteEngineUseCase"),
};

export function getContainerWithUseCases(container: Container): Container {
  container
    .bind(USE_CASE.GetEngineList)
    .toInstance(GetEngineListUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.CreateEngine)
    .toInstance(CreateEngineUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.DeleteEngine)
    .toInstance(DeleteEngineUseCase)
    .inTransientScope();

  return container;
}
