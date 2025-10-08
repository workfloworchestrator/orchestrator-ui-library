import React, { FC } from 'react';

import { WfoSortAsc, WfoSortDesc } from '../../../icons';
import { SortOrder } from '../../../types';
import { WfoSortButton } from './WfoSortButton';
import { getStyles } from './styles';

export type WfoSortButtonsProps = {
    sortOrder?: SortOrder;
    onChangeSortOrder: (updatedSortOrder: SortOrder) => void;
};

/**
 * @deprecated This component is not used anymore and will be removed in the next major version.
 */
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
