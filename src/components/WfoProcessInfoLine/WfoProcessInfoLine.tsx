import React, { FC, ReactNode } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoProcessInfoLineItem = { key: string; node: ReactNode };

export type WfoProcessInfoLineProps = {
  infoItems: WfoProcessInfoLineItem[];
};

// Info line under the title of the new layouts (process detail, start workflow)
export const WfoProcessInfoLine: FC<WfoProcessInfoLineProps> = ({ infoItems }) => {
  const { infoLineStyle, dividerStyle } = useWithOrchestratorTheme(getStyles);
  return (
    <div css={infoLineStyle}>
      {infoItems.map((infoItem, index) => (
        <React.Fragment key={infoItem.key}>
          {index > 0 && <span aria-hidden css={dividerStyle} />}
          {infoItem.node}
        </React.Fragment>
      ))}
    </div>
  );
};
