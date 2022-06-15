import { DocumentListViewModel } from "../presentation/DocumentListViewModel";
import { Container, token } from "brandi";
import { IDocumentListViewModel } from "../presentation/DocumentListViewModel/interfaces";
import { UploadingListViewModel } from "../presentation/UploadingListViewModel";
import { IUploadingListViewModel } from "../presentation/UploadingListViewModel/interfaces";

export const VIEW_MODEL = {
  DocumentList: token<IDocumentListViewModel>("DocumentListViewModel"),
  UploadingList: token<IUploadingListViewModel>("UploadingListViewModel"),
};

export function getContainerWithViewModels(container: Container): Container {
  container
    .bind(VIEW_MODEL.DocumentList)
    .toInstance(DocumentListViewModel)
    .inSingletonScope();
  container
    .bind(VIEW_MODEL.UploadingList)
    .toInstance(UploadingListViewModel)
    .inSingletonScope();

  return container;
}
