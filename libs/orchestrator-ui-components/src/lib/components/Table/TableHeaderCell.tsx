import React, { FC, ReactNode } from 'react';
import { SortDirection } from './columns';
import { SortDirectionIcon } from './SortDirectionIcon';

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
