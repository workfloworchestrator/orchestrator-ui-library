import React, { FC, ReactElement } from 'react';

import { EuiFlexGrid, useCurrentEuiBreakpoint } from '@elastic/eui';

import { getNumberOfColumns } from './getNumberOfColumns';

export type WfoSummaryCardsProps = {
  children: ReactElement[];
};

export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ children }) => {
  const currentBreakpoint = useCurrentEuiBreakpoint();

  return (
    <EuiFlexGrid responsive={false} columns={getNumberOfColumns(currentBreakpoint)} gutterSize="xl">
      {children}
    </EuiFlexGrid>
  );
};
