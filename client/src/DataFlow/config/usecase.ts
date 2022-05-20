import {
  ICreateItemUseCase,
  IDeleteItemUseCase,
  IGetListUseCase,
  IUpdateNewDocumentsCountUseCase,
} from "../domain/usecase/Document/interfaces";
import { Container, token } from "brandi";
import { UpdateNewDocumentsCountUseCase } from "../domain/usecase/Document/UpdateNewDocumentsCountUseCase";
import { CreateDocumentUseCase } from "../domain/usecase/Document/CreateDocumentUseCase";
import { DeleteDocumentUseCase } from "../domain/usecase/Document/DeleteDocumentUseCase";
import { GetDocumentListUseCase } from "../domain/usecase/Document/GetDocumentListUseCase";

export const USE_CASE = {
  GetDocumentList: token<IGetListUseCase>("GetDocumentListUseCase"),
  CreateDocument: token<ICreateItemUseCase>("CreateDocumentUseCase"),
  DeleteDocument: token<IDeleteItemUseCase>("DeleteDocumentUseCase"),
  UpdateNewDocumentsCount: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewDocumentsCount"
  ),
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
    .bind(USE_CASE.UpdateNewDocumentsCount)
    .toInstance(UpdateNewDocumentsCountUseCase)
    .inTransientScope();

  return container;
}
