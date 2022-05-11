import useDIContainer from '../useDIContainer';

/**
 * Возвращает нужную view model
 *
 * @param {symbol} vmSymbol - view model
 */
export default function useViewModel<T>(vmSymbol: symbol): T {
  const container = useDIContainer();
  if (!container.isRegistered(vmSymbol)) {
    throw Error('View model does not bound in container!');
  }

  return container.resolve<T>(vmSymbol);
}
