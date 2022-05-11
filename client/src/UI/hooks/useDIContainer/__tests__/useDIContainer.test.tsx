import { FC } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useDIContainer from '../index';
import { Bootstrap } from '../../../../../../Bootstrap';
import DIContainerProvider from '../../../providers/DIContainerProvider';

const bootstrap = new Bootstrap();

const diContainer = bootstrap.getDiContainer();

describe('useDIContainer', () => {
  it('should return di container', () => {
    expect.hasAssertions();

    const wrapper: FC = ({ children }) => (
      <DIContainerProvider container={diContainer}>
        {children}
      </DIContainerProvider>
    );

    const { result } = renderHook(() => useDIContainer(), { wrapper });

    expect(result.current).toStrictEqual(diContainer);
  });
});
