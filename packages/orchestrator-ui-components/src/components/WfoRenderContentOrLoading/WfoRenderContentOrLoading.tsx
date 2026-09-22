import React, { FC, ReactNode } from 'react';

import { EuiLoadingSpinner, EuiLoadingSpinnerProps } from '@elastic/eui';

export type WfoRenderContentOrLoadingProps = {
  isLoading: boolean;
  children: ReactNode;
  size?: EuiLoadingSpinnerProps['size'];
};

export const WfoRenderContentOrLoading: FC<WfoRenderContentOrLoadingProps> = ({ isLoading, children, size = 's' }) =>
  isLoading ? <EuiLoadingSpinner size={size} /> : <>{children}</>;
