import React, { FC, ReactNode } from 'react';
import { EuiBadge } from '@elastic/eui';
import { EuiBadgeProps, _EuiThemeColorsMode } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import Image from 'next/image';
import { StaticImageData } from 'next/dist/client/image';

export type HeaderBadgeProps = EuiBadgeProps & {
    color: keyof _EuiThemeColorsMode;
    children: ReactNode;
};

export type HeaderBadgeLogoProps = {
    logoSrc: string | StaticImageData;
    logoAlt: string;
};

export type HeaderBadgeWithLogoProps = HeaderBadgeLogoProps & HeaderBadgeProps;

export const HeaderBadge: FC<HeaderBadgeProps> = (props: HeaderBadgeProps) => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiBadge
            {...props}
            color={theme.colors[props.color]}
            css={{ height: 24, display: 'flex' }}
        >
            {props.children}
        </EuiBadge>
    );
};

export const HeaderBadgeWithLogo: FC<HeaderBadgeWithLogoProps> = (
    props: HeaderBadgeWithLogoProps,
) => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiBadge
            {...props}
            color={theme.colors[props.color]}
            css={{ height: 24, display: 'flex', paddingLeft: 0 }}
            iconType={() => <Image src={props.logoSrc} alt={props.logoAlt} />}
        >
            {props.children}
        </EuiBadge>
    );
};
