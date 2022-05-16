import { GetEngineListUseCase } from "../../../DataFlow/domain/usecase/Engine/GetEngineListUseCase";
import { CreateEngineUseCase } from "../../../DataFlow/domain/usecase/Engine/CreateEngineUseCase";
import { DeleteEngineUseCase } from "../../../DataFlow/domain/usecase/Engine/DeleteEngineUseCase";
import { CreateTransmissionUseCase } from "../../../DataFlow/domain/usecase/Transmission/CreateTransmissionUseCase";
import { GetTransmissionListUseCase } from "../../../DataFlow/domain/usecase/Transmission/GetTransmissionListUseCase";
import { DeleteTransmissionUseCase } from "../../../DataFlow/domain/usecase/Transmission/DeleteTransmissionUseCase";
import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../../../DataFlow/domain/usecase/Document/interfaces";
import { Container, token } from "brandi";

export const USE_CASE = {
  GetEngineList: token<IGetListUseCase>("GetEngineListUseCase"),
  CreateEngine: token<ICreateItemUseCase>("CreateEngineUseCase"),
  DeleteEngine: token<IDeleteItemUseCase>("DeleteEngineUseCase"),
  GetTransmissionList: token<IGetListUseCase>("GetTransmissionListUseCase"),
  CreateTransmission: token<ICreateItemUseCase>("CreateTransmissionUseCase"),
  DeleteTransmission: token<IDeleteItemUseCase>("DeleteTransmissionUseCase"),
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

  container
    .bind(USE_CASE.GetTransmissionList)
    .toInstance(GetTransmissionListUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.CreateTransmission)
    .toInstance(CreateTransmissionUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.DeleteTransmission)
    .toInstance(DeleteTransmissionUseCase)
    .inTransientScope();

  return container;
}
