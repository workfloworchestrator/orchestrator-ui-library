import React, { FC, ReactNode } from 'react';

import { WfoToolTip } from '@/components';

interface WfoDataCellProps {
  customTooltip: ReactNode;
  children: ReactNode;
}

export const WfoDataCell: FC<WfoDataCellProps> = ({ customTooltip, children }) => {
  const tooltipContent = customTooltip || (typeof children === 'string' ? children : null);

  if (tooltipContent) {
    return <WfoToolTip tooltipContent={tooltipContent}>{children}</WfoToolTip>;
  }
  return <>{children}</>;
};
