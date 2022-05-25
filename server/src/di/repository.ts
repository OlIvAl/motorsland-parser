import { Container, token } from "brandi";
import { IDocumentRepository } from "../domain/repository/Document";
import { UploadingRepository } from "../data/repository/Document/UploadingRepository";
import { IUploadingRepository } from "../domain/repository/Uploading";
import { DocumentRepository } from "../data/repository/Document/DocumentRepository";

export const REPOSITORY = {
  Uploading: token<IUploadingRepository>("UploadingRepository"),
  Document: token<IDocumentRepository>("DocumentRepository"),
};

export function getContainerWithReps(container: Container): Container {
  container
    .bind(REPOSITORY.Uploading)
    .toInstance(UploadingRepository)
    .inTransientScope();
  container
    .bind(REPOSITORY.Document)
    .toInstance(DocumentRepository)
    .inTransientScope();

  return container;
}
