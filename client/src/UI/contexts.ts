import { createContext } from 'react';
import { DependencyContainer } from 'tsyringe';
import { ErrorCollector } from '../libs/ErrorCollector/ErrorCollector';

export const ErrorHandlerContext = createContext<ErrorCollector | null>(
  null
);

export const DIContainerContext = createContext<DependencyContainer | null>(
  null
);

if (process.env.NODE_ENV !== 'production') {
  ErrorHandlerContext.displayName = 'ErrorHandlerContext';
  DIContainerContext.displayName = 'DIContainerContext';
}
