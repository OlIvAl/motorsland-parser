import { Container, token } from "brandi";
import { IDocumentController } from "../presentation/interfaces";
import { TransmissionController } from "../presentation/TransmissionController";
import { EngineController } from "../presentation/EngineController";

export const CONTROLLER = {
  Engine: token<IDocumentController>("EngineController"),
  Transmission: token<IDocumentController>("TransmissionController"),
};

export function getContainerWithControllers(container: Container): Container {
  container
    .bind(CONTROLLER.Engine)
    .toInstance(EngineController)
    .inTransientScope();
  container
    .bind(CONTROLLER.Transmission)
    .toInstance(TransmissionController)
    .inTransientScope();

  return container;
}
