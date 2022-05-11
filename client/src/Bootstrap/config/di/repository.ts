import { DependencyContainer } from "tsyringe";
import { EngineRepository } from "../../../data/repository/Document/EngineRepository";
import { IDocumentRepository } from "../../../domain/repository/Document/interfaces";
import { TransmissionRepository } from "../../../data/repository/Document/TransmissionRepository";

export const REPOSITORY = {
  Engine: Symbol.for("EngineRepository"),
  Transmission: Symbol.for("TransmissionRepository"),
};

export function getContainerWithReps(
  container: DependencyContainer
): DependencyContainer {
  container.register<IDocumentRepository>(REPOSITORY.Engine, EngineRepository);
  container.register<IDocumentRepository>(
    REPOSITORY.Transmission,
    TransmissionRepository
  );

  return container;
}
