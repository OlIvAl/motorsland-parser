import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
} from "../domain/usecase/Document/interfaces";
import { Container, token } from "brandi";
import { CreateDocumentUseCase } from "../domain/usecase/Document/CreateDocumentUseCase";
import { DeleteDocumentUseCase } from "../domain/usecase/Document/DeleteDocumentUseCase";
import { GetDocumentListUseCase } from "../domain/usecase/Document/GetDocumentListUseCase";
import { IGetUploadingListUseCase } from "../domain/usecase/Uploading/interfaces";
import { GetUploadingListUseCase } from "../domain/usecase/Uploading/GetUploadingListUseCase";

export const USE_CASE = {
  GetDocumentList: token<IGetListUseCase>("GetDocumentListUseCase"),
  CreateDocument: token<ICreateItemUseCase>("CreateDocumentUseCase"),
  DeleteDocument: token<IDeleteItemUseCase>("DeleteDocumentUseCase"),
  GetUploadingList: token<IGetUploadingListUseCase>("GetUploadingListUseCase"),
};

export function getContainerWithUseCases(container: Container): Container {
  container
    .bind(USE_CASE.GetDocumentList)
    .toInstance(GetDocumentListUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.CreateDocument)
    .toInstance(CreateDocumentUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.DeleteDocument)
    .toInstance(DeleteDocumentUseCase)
    .inTransientScope();

  container
    .bind(USE_CASE.GetUploadingList)
    .toInstance(GetUploadingListUseCase)
    .inTransientScope();

  return container;
}
