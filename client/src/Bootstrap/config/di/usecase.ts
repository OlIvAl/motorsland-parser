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
  IUpdateNewDocumentsCountUseCase,
} from "../../../DataFlow/domain/usecase/Document/interfaces";
import { Container, token } from "brandi";
import { UpdateNewEnginesCountUseCase } from "../../../DataFlow/domain/usecase/Engine/UpdateNewEnginesCountUseCase";
import { UpdateNewTransmissionsCountUseCase } from "../../../DataFlow/domain/usecase/Transmission/UpdateNewTransmissionsCountUseCase";

export const USE_CASE = {
  GetEngineList: token<IGetListUseCase>("GetEngineListUseCase"),
  GetTransmissionList: token<IGetListUseCase>("GetTransmissionListUseCase"),

  CreateEngine: token<ICreateItemUseCase>("CreateEngineUseCase"),
  CreateTransmission: token<ICreateItemUseCase>("CreateTransmissionUseCase"),

  DeleteEngine: token<IDeleteItemUseCase>("DeleteEngineUseCase"),
  DeleteTransmission: token<IDeleteItemUseCase>("DeleteTransmissionUseCase"),

  UpdateNewEnginesCount: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewEnginesCount"
  ),
  UpdateNewTransmissionsCount: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewTransmissionsCount"
  ),
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
    .bind(USE_CASE.UpdateNewEnginesCount)
    .toInstance(UpdateNewEnginesCountUseCase)
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
  container
    .bind(USE_CASE.UpdateNewTransmissionsCount)
    .toInstance(UpdateNewTransmissionsCountUseCase)
    .inTransientScope();

  return container;
}
