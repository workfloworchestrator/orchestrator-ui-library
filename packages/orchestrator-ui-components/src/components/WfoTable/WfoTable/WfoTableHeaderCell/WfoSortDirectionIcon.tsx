import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsUpDown } from '@/icons';
import { WfoArrowLongDown } from '@/icons/heroicons/WfoArrowLongDown';
import { WfoArrowLongUp } from '@/icons/heroicons/WfoArrowLongUp';
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

    // Todo replace with Heroicons (0 margin)
    return sortDirection === SortOrder.ASC ? (
        <WfoArrowLongUp color={theme.colors.subduedText} />
    ) : (
        <WfoArrowLongDown color={theme.colors.subduedText} />
    );
};
