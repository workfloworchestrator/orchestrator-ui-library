import { Badge } from '../Badge';
import { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';

export type WFOProductBlockBadgeProps = {
    children: string;
};

export const WFOProductBlockBadge: FC<WFOProductBlockBadgeProps> = ({
    children,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    return (
        <Badge
            textColor={theme.colors.link}
            color={toSecondaryColor(theme.colors.primary)}
        >
            {children}
        </Badge>
    );
};
