import React, { FC, ReactNode } from 'react';

import { useOrchestratorTheme } from '@/hooks';

export type WfoProcessInfoLineItem = { key: string; node: ReactNode };

export type WfoProcessInfoLineProps = {
  infoItems: WfoProcessInfoLineItem[];
};

// Info line under the title of the new layouts (process detail, start workflow): 12px between items, thin dividers
export const WfoProcessInfoLine: FC<WfoProcessInfoLineProps> = ({ infoItems }) => {
  const { theme } = useOrchestratorTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: theme.size.m,
        rowGap: theme.size.xs,
        marginTop: theme.size.xs,
        marginBottom: theme.size.s,
      }}
    >
      {infoItems.map((infoItem, index) => (
        <React.Fragment key={infoItem.key}>
          {index > 0 && <span aria-hidden css={{ width: 1, height: 16, background: theme.colors.borderBaseSubdued }} />}
          {infoItem.node}
        </React.Fragment>
      ))}
    </div>
  );
};
