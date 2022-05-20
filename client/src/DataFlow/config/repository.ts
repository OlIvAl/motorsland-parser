import { IDocumentRepository } from "../domain/repository/Document/interfaces";
import { Container, token } from "brandi";
import { DocumentRepository } from "../data/repository/Document/DocumentRepository";

export const REPOSITORY = {
  Document: token<IDocumentRepository>("DocumentRepository"),
};

export function getContainerWithReps(container: Container): Container {
  container
    .bind(REPOSITORY.Document)
    .toInstance(DocumentRepository)
    .inTransientScope();

  return container;
}
