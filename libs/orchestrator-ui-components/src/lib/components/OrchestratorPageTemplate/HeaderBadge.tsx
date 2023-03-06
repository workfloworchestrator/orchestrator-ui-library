import React, { FC, ReactNode } from 'react';
import { EuiBadge } from '@elastic/eui';
import { EuiBadgeProps, _EuiThemeColorsMode } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';

export type HeaderBadgeProps = EuiBadgeProps & {
    color: keyof _EuiThemeColorsMode;
    children: ReactNode;
};

export const HeaderBadge: FC<HeaderBadgeProps> = (props: HeaderBadgeProps) => {
    const { theme } = useOrchestratorTheme();

    const css =
        props.iconType !== undefined
            ? { height: 24, display: 'flex', paddingLeft: 0 }
            : { height: 24, display: 'flex' };

    return (
        <EuiBadge {...props} color={theme.colors[props.color]} css={css}>
            {props.children}
        </EuiBadge>
    );
};
