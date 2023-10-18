import { SortOrder } from '../../../types';
import React, { FC } from 'react';
import { WFOSortButton } from './WFOSortButton';
import { WFOSortAsc, WFOSortDesc } from '../../../icons';

export type WFOSortButtonsProps = {
    sortOrder?: SortOrder;
    onChangeSortOrder?: (updatedSortOrder: SortOrder) => void;
};

export const WFOSortButtons: FC<WFOSortButtonsProps> = ({
    sortOrder,
    onChangeSortOrder,
}) => {
    return (
        <div css={{ display: 'flex', alignItems: 'center' }}>
            <WFOSortButton
                WFOIconComponent={WFOSortAsc}
                isActive={sortOrder !== SortOrder.ASC}
                onClick={() => onChangeSortOrder?.(SortOrder.ASC)}
            />
            <WFOSortButton
                WFOIconComponent={WFOSortDesc}
                isActive={sortOrder !== SortOrder.DESC}
                onClick={() => onChangeSortOrder?.(SortOrder.DESC)}
            />
        </div>
    );
};
