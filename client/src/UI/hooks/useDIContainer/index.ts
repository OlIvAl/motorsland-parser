import { DependencyContainer } from "tsyringe";
import { useContext } from "react";
import { DIContainerContext } from "../../contexts";

/**
 * Возвращает контейнер
 */
export default function useDIContainer(): DependencyContainer {
  return useContext(DIContainerContext) as DependencyContainer;
}
