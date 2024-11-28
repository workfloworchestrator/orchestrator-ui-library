import React, { FC, ReactElement } from 'react';

import { WfoIconProps } from '@/icons';

export type WfoHeroIconsWrapperProps = {
    children: ReactElement;
    className?: string;
};

export const WfoHeroIconsWrapper: FC<WfoHeroIconsWrapperProps> = ({
    children,
    className,
}) => (
    <div
        className={className}
        css={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
        }}
    >
        {children}
    </div>
);

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
