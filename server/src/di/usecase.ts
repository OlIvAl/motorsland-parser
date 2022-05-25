import { Container, token } from "brandi";
import {
  ICreateDocumentUseCase,
  IDeleteDocumentUseCase,
  IGetDocumentListUseCase,
  IGetDocumentUseCase,
  IUpdateNewDocumentsCountUseCase,
} from "../domain/usecase/Document/interfaces";
import { GetDocumentListUseCase } from "../domain/usecase/Document/GetDocumentListUseCase";
import { CreateDocumentUseCase } from "../domain/usecase/Document/CreateDocumentUseCase";
import { DeleteDocumentUseCase } from "../domain/usecase/Document/DeleteDocumentUseCase";
import { UpdateNewDocumentsCountUseCase } from "../domain/usecase/Document/UpdateNewDocumentsCountUseCase";
import { GetDocumentUseCase } from "../domain/usecase/Document/GetDocumentUseCase";

export const USE_CASE = {
  GetDocumentList: token<IGetDocumentListUseCase>("GetDocumentListUseCase"),
  GetDocument: token<IGetDocumentUseCase>("GetDocumentUseCase"),
  CreateDocument: token<ICreateDocumentUseCase>("CreateDocumentUseCase"),
  DeleteDocument: token<IDeleteDocumentUseCase>("DeleteDocumentUseCase"),
  UpdateNewDocumentsCount: token<IUpdateNewDocumentsCountUseCase>(
    "UpdateNewDocumentsCountUseCase"
  ),
};

export function getContainerWithUseCases(container: Container): Container {
  container
    .bind(USE_CASE.GetDocumentList)
    .toInstance(GetDocumentListUseCase)
    .inTransientScope();
  container
    .bind(USE_CASE.GetDocument)
    .toInstance(GetDocumentUseCase)
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
