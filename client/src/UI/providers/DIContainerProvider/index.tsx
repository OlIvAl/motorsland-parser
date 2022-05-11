import { FC } from "react";
import { DIContainerContext } from "../../contexts";
import { DependencyContainer } from "tsyringe";

interface IProps {
  container: DependencyContainer;
  children: JSX.Element;
}

const DIContainerProvider: FC<IProps> = ({ container, children }) => (
  <DIContainerContext.Provider value={container}>
    {children}
  </DIContainerContext.Provider>
);

export default DIContainerProvider;
