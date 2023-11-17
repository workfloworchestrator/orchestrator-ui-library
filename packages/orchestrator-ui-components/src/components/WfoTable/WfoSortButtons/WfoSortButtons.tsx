import React, { FC } from 'react';

import { getStyles } from './styles';
import { WfoSortButton } from './WfoSortButton';
import { WfoSortAsc, WfoSortDesc } from '../../../icons';
import { SortOrder } from '../../../types';

export type WfoSortButtonsProps = {
    sortOrder?: SortOrder;
    onChangeSortOrder: (updatedSortOrder: SortOrder) => void;
};

export const WfoSortButtons: FC<WfoSortButtonsProps> = ({
    sortOrder,
    onChangeSortOrder,
}) => {
    const { sortButtonsContainerStyle } = getStyles();

    return (
        <div css={sortButtonsContainerStyle}>
            <WfoSortButton
                WfoIconComponent={WfoSortAsc}
                isActive={sortOrder !== SortOrder.ASC}
                onClick={() => onChangeSortOrder(SortOrder.ASC)}
            />
            <WfoSortButton
                WfoIconComponent={WfoSortDesc}
                isActive={sortOrder !== SortOrder.DESC}
                onClick={() => onChangeSortOrder(SortOrder.DESC)}
            />
        </div>
    );
};
