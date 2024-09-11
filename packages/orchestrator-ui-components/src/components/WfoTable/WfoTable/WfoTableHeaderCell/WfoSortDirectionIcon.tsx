import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowNarrowDown, WfoArrowNarrowUp } from '@/icons';
import { SortOrder } from '@/types';

export type WfoSortDirectionIconProps = {
    sortDirection: SortOrder;
};

export const WfoSortDirectionIcon: FC<WfoSortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    return sortDirection === SortOrder.ASC ? (
        <WfoArrowNarrowUp
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    ) : (
        <WfoArrowNarrowDown
            color={theme.colors.subduedText}
            height={24}
            width={24}
        />
    );
};
