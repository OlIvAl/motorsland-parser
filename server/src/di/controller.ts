import { Container, token } from "brandi";
import { IDocumentController } from "../presentation/interfaces";
import { DocumentController } from "../presentation/DocumentController";

export const CONTROLLER = {
  Document: token<IDocumentController>("DocumentController"),
};

export function getContainerWithControllers(container: Container): Container {
  container
    .bind(CONTROLLER.Document)
    .toInstance(DocumentController)
    .inTransientScope();

  return container;
}
