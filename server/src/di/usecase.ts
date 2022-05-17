import { Container, token } from "brandi";
import {
  ICreateDocumentUseCase,
  IDeleteDocumentUseCase,
  IGetDocumentListUseCase,
  IUpdateNewDocumentsCountUseCase,
} from "../domain/usecase/Document/interfaces";
import { CreateTransmissionUseCase } from "../domain/usecase/Transmission/CreateTransmissionUseCase";
import { DeleteEngineUseCase } from "../domain/usecase/Engine/DeleteEngineUseCase";
import { CreateEngineUseCase } from "../domain/usecase/Engine/CreateEngineUseCase";
import { GetTransmissionListUseCase } from "../domain/usecase/Transmission/GetTransmissionListUseCase";
import { GetEngineListUseCase } from "../domain/usecase/Engine/GetEngineListUseCase";
import { DeleteTransmissionUseCase } from "../domain/usecase/Transmission/DeleteTransmissionUseCase";
import { UpdateNewDocumentsCountUseCase } from "../domain/usecase/Document/UpdateNewDocumentsCountUseCase";
import { UpdateNewEnginesCountUseCase } from "../domain/usecase/Document/UpdateNewEnginesCountUseCase";
import { UpdateNewTransmissionsCountUseCase } from "../domain/usecase/Document/UpdateNewTransmissionsCountUseCase";

export const USE_CASE = {
  GetEngineList: token<IGetDocumentListUseCase>("GetEngineListUseCase"),
  GetTransmissionList: token<IGetDocumentListUseCase>(
    "GetTransmissionListUseCase"
  ),

  CreateEngine: token<ICreateDocumentUseCase>("CreateEngineUseCase"),
  CreateTransmission: token<ICreateDocumentUseCase>(
    "CreateTransmissionUseCase"
  ),

  DeleteTransmission: token<IDeleteDocumentUseCase>(
    "DeleteTransmissionUseCase"
  ),
  DeleteEngine: token<IDeleteDocumentUseCase>("DeleteEngineUseCase"),

  UpdateNewEnginesCountUseCase: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewEnginesCountUseCase"
  ),
  UpdateNewTransmissionsCountUseCase: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewTransmissionsCountUseCase"
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
    .bind(USE_CASE.UpdateNewEnginesCountUseCase)
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
    .bind(USE_CASE.UpdateNewTransmissionsCountUseCase)
    .toInstance(UpdateNewTransmissionsCountUseCase)
    .inTransientScope();

  return container;
}
