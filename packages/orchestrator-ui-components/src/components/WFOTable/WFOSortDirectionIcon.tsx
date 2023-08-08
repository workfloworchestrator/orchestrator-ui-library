import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { ArrowNarrowDown } from '../../icons/ArrowNarrowDown';
import { ArrowNarrowUp } from '../../icons/ArrowNarrowUp';
import { SortOrder } from '../../types';

export type WFOSortDirectionIconProps = {
    sortDirection: SortOrder;
};

export const WFOSortDirectionIcon: FC<WFOSortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    return sortDirection === SortOrder.ASC ? (
        <ArrowNarrowUp
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    ) : (
        <ArrowNarrowDown
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    );
};
