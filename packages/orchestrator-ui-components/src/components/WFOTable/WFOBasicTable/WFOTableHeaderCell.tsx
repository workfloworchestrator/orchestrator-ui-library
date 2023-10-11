import React, { FC, ReactNode } from 'react';

import { SortOrder } from '../../../types';
import { WFOSortDirectionIcon } from './WFOSortDirectionIcon';

export type WFOTableHeaderCellProps = {
    sortDirection?: SortOrder;
    onClick?: () => void;
    sortable?: boolean;
    children: ReactNode;
};

export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
    sortDirection,
    children,
    onClick,
    sortable = true,
}) => (
    <div
        css={{
            display: 'flex',
            alignItems: 'center',
            cursor: sortable ? 'pointer' : 'not-allowed',
        }}
        onClick={sortable ? onClick : undefined}
    >
        <div>{children}</div>
        {sortable && sortDirection ? (
            <WFOSortDirectionIcon sortDirection={sortDirection} />
        ) : null}
    </div>
);
