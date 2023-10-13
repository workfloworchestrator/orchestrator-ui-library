import React, { FC, ReactNode } from 'react';

import { SortOrder } from '../../../types';
import { WFOSortDirectionIcon } from './WFOSortDirectionIcon';

export type WFOTableHeaderCellProps = {
    sortDirection?: SortOrder;
    onClick?: () => void;
    isSortable?: boolean;
    children: ReactNode;
};

export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
    sortDirection,
    children,
    onClick,
    isSortable = true,
}) => (
    <div
        css={{
            display: 'flex',
            alignItems: 'center',
            cursor: isSortable ? 'pointer' : 'not-allowed',
        }}
        onClick={isSortable ? onClick : undefined}
    >
        <div>{children}</div>
        {isSortable && sortDirection ? (
            <WFOSortDirectionIcon sortDirection={sortDirection} />
        ) : null}
    </div>
);
