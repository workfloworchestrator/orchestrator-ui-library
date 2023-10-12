import { WFOBadge } from '../WFOBadge';
import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';

export type WFOProductBlockBadgeProps = {
    children: string;
};

export const WFOProductBlockBadge: FC<WFOProductBlockBadgeProps> = ({
    children,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    return (
        <WFOBadge
            textColor={theme.colors.link}
            color={toSecondaryColor(theme.colors.primary)}
        >
            {children.toLowerCase()}
        </WFOBadge>
    );
};
