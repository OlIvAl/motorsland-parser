import { Container, token } from "brandi";
import { IDocumentRepository } from "../domain/repository/Document/interfaces";
import { TransmissionRepository } from "../data/repository/Document/TransmissionRepository";
import { EngineRepository } from "../data/repository/Document/EngineRepository";

export const REPOSITORY = {
  Engine: token<IDocumentRepository>("EngineRepository"),
  Transmission: token<IDocumentRepository>("TransmissionRepository"),
};

export function getContainerWithReps(container: Container): Container {
  container
    .bind(REPOSITORY.Engine)
    .toInstance(EngineRepository)
    .inTransientScope();
  container
    .bind(REPOSITORY.Transmission)
    .toInstance(TransmissionRepository)
    .inTransientScope();

  return container;
}