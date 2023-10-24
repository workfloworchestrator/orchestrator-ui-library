import { SortOrder } from '../../../types';
import React, { FC } from 'react';
import { WFOSortButton } from './WFOSortButton';
import { WFOSortAsc, WFOSortDesc } from '../../../icons';
import { getStyles } from './styles';

export type WFOSortButtonsProps = {
    sortOrder?: SortOrder;
    onChangeSortOrder: (updatedSortOrder: SortOrder) => void;
};

export const WFOSortButtons: FC<WFOSortButtonsProps> = ({
    sortOrder,
    onChangeSortOrder,
}) => {
    const { sortButtonsContainerStyle } = getStyles();

    return (
        <div css={sortButtonsContainerStyle}>
            <WFOSortButton
                WFOIconComponent={WFOSortAsc}
                isActive={sortOrder !== SortOrder.ASC}
                onClick={() => onChangeSortOrder(SortOrder.ASC)}
            />
            <WFOSortButton
                WFOIconComponent={WFOSortDesc}
                isActive={sortOrder !== SortOrder.DESC}
                onClick={() => onChangeSortOrder(SortOrder.DESC)}
            />
        </div>
    );
};
