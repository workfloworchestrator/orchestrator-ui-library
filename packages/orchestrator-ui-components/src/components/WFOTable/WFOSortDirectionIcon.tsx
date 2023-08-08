import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { WFOArrowNarrowDown } from '../../icons/WFOArrowNarrowDown';
import { WFOArrowNarrowUp } from '../../icons/WFOArrowNarrowUp';
import { SortOrder } from '../../types';

export type WFOSortDirectionIconProps = {
    sortDirection: SortOrder;
};

export const WFOSortDirectionIcon: FC<WFOSortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    return sortDirection === SortOrder.ASC ? (
        <WFOArrowNarrowUp
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    ) : (
        <WFOArrowNarrowDown
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    );
};
