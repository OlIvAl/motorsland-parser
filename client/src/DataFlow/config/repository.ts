import {
  IDocumentRepository,
  IUploadingRepository,
} from "../domain/repository/Document/interfaces";
import { Container, token } from "brandi";
import { DocumentRepository } from "../data/repository/Document/DocumentRepository";
import { UploadingRepository } from "../data/repository/Uploading/UploadingRepository";

export const REPOSITORY = {
  Document: token<IDocumentRepository>("DocumentRepository"),
  Uploading: token<IUploadingRepository>("UploadingRepository"),
};

export function getContainerWithReps(container: Container): Container {
  container
    .bind(REPOSITORY.Document)
    .toInstance(DocumentRepository)
    .inTransientScope();
  container
    .bind(REPOSITORY.Uploading)
    .toInstance(UploadingRepository)
    .inTransientScope();

  return container;
}
