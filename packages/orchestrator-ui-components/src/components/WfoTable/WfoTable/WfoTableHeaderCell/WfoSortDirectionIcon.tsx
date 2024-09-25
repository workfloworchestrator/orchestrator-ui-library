import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import {
    WfoArrowNarrowDown,
    WfoArrowNarrowUp,
    WfoArrowsUpDown,
    WfoHeroIconsWrapper,
} from '@/icons';
import { SortOrder } from '@/types';

export type WfoSortDirectionIconProps = {
    sortDirection?: SortOrder;
};

export const WfoSortDirectionIcon: FC<WfoSortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    if (!sortDirection) {
        return (
            <WfoHeroIconsWrapper
                className="sortableIcon"
                css={{ visibility: 'hidden' }}
            >
                <WfoArrowsUpDown color={theme.colors.subduedText} />
            </WfoHeroIconsWrapper>
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
