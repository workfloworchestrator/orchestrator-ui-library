import React, { FC, ReactNode } from 'react';

import { EuiIcon, EuiPanel, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import type { IconType } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getWfoCallOutStyles } from './styles';

export type WfoCallOutColor = 'primary' | 'success' | 'warning' | 'danger';

export type WfoCallOutProps = {
  title?: ReactNode;
  color?: WfoCallOutColor;
  iconType?: IconType;
  size?: 's' | 'm';
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
  'data-testid'?: string;
  children?: ReactNode;
};

/**
 * Callout with the EUI 113 look: the icon inline in front of a title coloured to match the callout.
 *
 * EUI 122 rebuilt EuiCallOut: the title is no longer coloured, and the icon moved out of the title
 * into a separate, vertically centred column. The icon's DOM position changed, so this can't be
 * restored with CSS; this component renders the previous structure instead.
 */
export const WfoCallOut: FC<WfoCallOutProps> = ({
  title,
  color = 'primary',
  iconType,
  size = 'm',
  heading: Heading = 'p',
  className,
  'data-testid': dataTestId,
  children,
}) => {
  const { getTitleStyle, iconStyle } = useWithOrchestratorTheme(getWfoCallOutStyles);

  const header = title && (
    <EuiTitle size={size === 's' ? 'xxs' : 'xs'} css={getTitleStyle(color)}>
      <Heading>
        {iconType && <EuiIcon css={iconStyle} type={iconType} size="m" aria-hidden="true" color="inherit" />}
        {title}
      </Heading>
    </EuiTitle>
  );

  const body = children && (
    <EuiText size={size === 's' ? 'xs' : 's'} color="default">
      {children}
    </EuiText>
  );

  return (
    <EuiPanel
      className={className}
      data-testid={dataTestId}
      borderRadius="none"
      color={color}
      hasShadow={false}
      hasBorder={false}
      paddingSize={size === 's' ? 's' : 'm'}
      grow={false}
    >
      {header}
      {header && body && <EuiSpacer size="s" />}
      {body}
    </EuiPanel>
  );
};
