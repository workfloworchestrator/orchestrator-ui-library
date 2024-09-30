import React, { FC, ReactElement } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoIconProps } from '@/icons';

export type WfoHeroIconsWrapperProps = {
    children: ReactElement;
    className?: string;
};

export const WfoHeroIconsWrapper: FC<WfoHeroIconsWrapperProps> = ({
    children,
    className,
}) => {
    const { theme } = useOrchestratorTheme();

    return (
        <div
            className={className}
            css={{
                marginLeft: theme.size.xs,
                marginRight: theme.size.xs,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    );
};

export const withWfoHeroIconsWrapper = (Icon: FC<WfoIconProps>) => {
    const wfoHeroIconsWrapperWithIcon = ({
        className,
        ...iconProps
    }: WfoIconProps & Omit<WfoHeroIconsWrapperProps, 'children'>) => (
        <WfoHeroIconsWrapper className={className}>
            <Icon {...iconProps} />
        </WfoHeroIconsWrapper>
    );
    wfoHeroIconsWrapperWithIcon.displayName = 'WfoHeroIconsWrapper';
    return wfoHeroIconsWrapperWithIcon;
};
