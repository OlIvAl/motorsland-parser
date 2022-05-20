import { DocumentListViewModel } from "../presentation/DocumentListViewModel";
import { Container, token } from "brandi";
import { IDocumentListViewModel } from "../presentation/DocumentListViewModel/interfaces";

export const VIEW_MODEL = {
  DocumentList: token<IDocumentListViewModel>("DocumentListViewModel"),
};

export function getContainerWithViewModels(container: Container): Container {
  container
    .bind(VIEW_MODEL.DocumentList)
    .toInstance(DocumentListViewModel)
    .inSingletonScope();

  return container;
}
