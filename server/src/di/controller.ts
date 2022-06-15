import { Container, token } from "brandi";
import {
  IDocumentController,
  IUploadingController,
} from "../presentation/interfaces";
import { DocumentController } from "../presentation/DocumentController";
import { UploadingController } from "../presentation/UploadingController";

export const CONTROLLER = {
  Document: token<IDocumentController>("DocumentController"),
  Uploading: token<IUploadingController>("UploadingController"),
};

export function getContainerWithControllers(container: Container): Container {
  container
    .bind(CONTROLLER.Document)
    .toInstance(DocumentController)
    .inTransientScope();
  container
    .bind(CONTROLLER.Uploading)
    .toInstance(UploadingController)
    .inTransientScope();

  return container;
}
