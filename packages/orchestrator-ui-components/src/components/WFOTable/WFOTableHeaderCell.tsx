import React, { FC, ReactNode } from 'react';

import { SortOrder } from '../../types';
import { WFOSortDirectionIcon } from './WFOSortDirectionIcon';

export type WFOTableHeaderCellProps = {
    sortDirection?: SortOrder;
    onClick?: () => void;
    children: ReactNode;
};

export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
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
        {sortDirection ? (
            <WFOSortDirectionIcon sortDirection={sortDirection} />
        ) : null}
    </div>
);
