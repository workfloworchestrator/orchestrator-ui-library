import React, { FC, ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { ArrowNarrowDown, ArrowNarrowUp } from '../../icons';
import { SortDirection } from './columns';

export type TableHeaderCellProps = {
    sortDirection?: SortDirection;
    onClick?: () => void;
    children: ReactNode;
};

export const TableHeaderCell: FC<TableHeaderCellProps> = ({
    sortDirection,
    children,
    onClick,
}) => (
    <div
        css={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
        }}
        onClick={onClick}
    >
        <div>{children}</div>
        {sortDirection && <SortDirectionIcon sortDirection={sortDirection} />}
    </div>
);

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
