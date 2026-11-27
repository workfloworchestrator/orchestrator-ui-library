import React, { FC, ReactNode } from 'react';

import { EuiIcon, EuiScreenReaderOnly, EuiText, EuiToolTip } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoInfoItemProps = {
  icon: string;
  /** Names the value: shown on hover (unless there is a tooltip) and read by screen readers */
  label: string;
  tooltip?: ReactNode;
  children: ReactNode;
};

// One value in the info line. The icon is decoration; the hover text (and a hidden label) names the value.
export const WfoInfoItem: FC<WfoInfoItemProps> = ({ icon, label, tooltip, children }) => {
  const { infoItemStyle } = useWithOrchestratorTheme(getStyles);
  return (
    <EuiToolTip content={tooltip ?? label}>
      <span tabIndex={0} css={infoItemStyle}>
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
};
