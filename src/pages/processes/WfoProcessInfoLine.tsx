import React from 'react';

import { EuiIcon, EuiScreenReaderOnly, EuiText, EuiToolTip } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

// Info line under the title of the new layouts (process detail, start workflow).
// Icons are decoration; the hover text (and a hidden label) names the value.
export const InfoItem = ({
  icon,
  label,
  tooltip,
  children,
}: {
  icon: string;
  label: string;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <EuiToolTip content={tooltip ?? label}>
    <span tabIndex={0} css={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <EuiIcon type={icon} size="m" color="subdued" aria-hidden />
      <EuiScreenReaderOnly>
        <span>{label}</span>
      </EuiScreenReaderOnly>
      <EuiText size="s" color="subdued">
        {children}
      </EuiText>
    </span>
  </EuiToolTip>
);

export const InfoDivider = () => {
  const { theme } = useOrchestratorTheme();
  return <span aria-hidden css={{ width: 1, height: 16, background: theme.colors.borderBaseSubdued }} />;
};

export type InfoLineItem = { key: string; node: React.ReactNode };

// 12px between items, thin dividers
export const WfoProcessInfoLine = ({ infoItems }: { infoItems: InfoLineItem[] }) => {
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
          {index > 0 && <InfoDivider />}
          {infoItem.node}
        </React.Fragment>
      ))}
    </div>
  );
};
