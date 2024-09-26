import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowNarrowDown, WfoArrowNarrowUp, WfoArrowsUpDown } from '@/icons';
import { SortOrder } from '@/types';

import { SORTABLE_ICON_CLASS } from './styles';

export type WfoSortDirectionIconProps = {
    sortDirection?: SortOrder;
};

export const WfoSortDirectionIcon: FC<WfoSortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    if (!sortDirection) {
        return (
            <WfoArrowsUpDown
                className={SORTABLE_ICON_CLASS}
                css={{ visibility: 'hidden' }}
                color={theme.colors.subduedText}
            />
        );
    }

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
