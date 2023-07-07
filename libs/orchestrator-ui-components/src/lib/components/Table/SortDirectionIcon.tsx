import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { ArrowNarrowDown } from '../../icons/ArrowNarrowDown';
import { ArrowNarrowUp } from '../../icons/ArrowNarrowUp';
import { SortDirection } from './utils/columns';

export type SortDirectionIconProps = {
    sortDirection: SortDirection;
};

export const SortDirectionIcon: FC<SortDirectionIconProps> = ({
    sortDirection,
}) => {
    const { theme } = useOrchestratorTheme();

    return sortDirection === SortDirection.Asc ? (
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
