import React, { FC, ReactNode } from 'react';
import { EuiBadge } from '@elastic/eui';
import { EuiBadgeProps, _EuiThemeColorsMode } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';

export type HeaderBadgeProps = EuiBadgeProps & {
    children: ReactNode;
} & HeaderBadgeColor;

export type HeaderBadgeColor =
    | {
          color: keyof _EuiThemeColorsMode;
          customColor?: false;
      }
    | {
          color: string;
          customColor: true;
      };

export const HeaderBadge: FC<HeaderBadgeProps> = ({
    customColor,
    color,
    children,
    ...restProps
}) => {
    const { theme } = useOrchestratorTheme();

    const css = restProps.iconType
        ? {
              height: 24,
              display: 'flex',
              paddingLeft: 0,
          }
        : { height: 24, display: 'flex' };

    return (
        <EuiBadge
            {...restProps}
            color={!customColor ? theme.colors[color] : color}
            css={css}
        >
            {children}
        </EuiBadge>
    );
};
