import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowDown, WfoArrowUp, WfoArrowsUpDown } from '@/icons';
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
                height={16}
                width={16}
                className={SORTABLE_ICON_CLASS}
                css={{ visibility: 'hidden' }}
                color={theme.colors.subduedText}
            />
        );
    }

    return sortDirection === SortOrder.ASC ? (
        <WfoArrowUp color={theme.colors.subduedText} />
    ) : (
        <WfoArrowDown color={theme.colors.subduedText} />
    );
};
