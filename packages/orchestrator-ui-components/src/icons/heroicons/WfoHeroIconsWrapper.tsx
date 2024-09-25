import React, { FC, ReactElement } from 'react';

import { useOrchestratorTheme } from '@/hooks';

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
