import React, { FC, useState } from 'react';

import { SortOrder } from '../../../types';
import { WFOSortDirectionIcon } from './WFOSortDirectionIcon';
import {
    EuiFieldSearch,
    EuiHorizontalRule,
    EuiPopover,
    EuiText,
    useGeneratedHtmlId,
} from '@elastic/eui';
import { useWithOrchestratorTheme } from '../../../hooks';
import { WFOSortButtons } from '../WFOSortButtons';
import { getStyles } from './styles';
import { useTranslations } from 'next-intl';

export type WFOTableHeaderCellProps = {
    fieldName: string;
    sortOrder?: SortOrder;
    onSetSortOrder?: (updatedSortOrder: SortOrder) => void;
    onSearch?: (searchText: string) => void;
    children: string;
};

export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
    fieldName,
    sortOrder,
    children,
    onSetSortOrder,
    onSearch,
}) => {
    const {
        headerCellContentStyle,
        headerCellPopoverHeaderStyle,
        headerCellPopoverHeaderTitleStyle,
        headerCellPopoverContentStyle,
        getHeaderCellButtonStyle,
    } = useWithOrchestratorTheme(getStyles);
    const t = useTranslations('common');

    const isSortable = !!onSetSortOrder;
    const isFilterable = !!onSearch;
    const shouldShowPopover = isSortable || isFilterable;

    const smallContextMenuPopoverId = useGeneratedHtmlId({
        prefix: 'smallContextMenuPopover',
    });

    const [isPopoverOpen, setPopover] = useState(false);
    const handleButtonClick = () => setPopover(!isPopoverOpen);
    const closePopover = () => setPopover(false);

    const handleChangeSortOrder = (updatedSortOrder: SortOrder) => {
        onSetSortOrder?.(updatedSortOrder);
        closePopover();
    };

    const handleSearch = (searchText: string) => {
        onSearch?.(searchText);
        closePopover();
    };

    const WfoHeaderCellContentButton = () => (
        <button onClick={handleButtonClick} disabled={!shouldShowPopover}>
            <div css={getHeaderCellButtonStyle(shouldShowPopover)}>
                <div css={headerCellContentStyle}>{children}</div>
                {sortOrder && (
                    <WFOSortDirectionIcon sortDirection={sortOrder} />
                )}
            </div>
        </button>
    );

    const WfoPopoverHeader = () => (
        <div css={headerCellPopoverHeaderStyle}>
            <EuiText size="xs" css={headerCellPopoverHeaderTitleStyle}>
                {children}
            </EuiText>
            {isSortable && (
                <WFOSortButtons
                    sortOrder={sortOrder}
                    onChangeSortOrder={handleChangeSortOrder}
                />
            )}
        </div>
    );

    const WfoPopoverContent = () => (
        <div css={headerCellPopoverContentStyle}>
            <EuiFieldSearch
                className={fieldName}
                placeholder={t('search')}
                onSearch={handleSearch}
                isClearable={false}
            />
        </div>
    );

    return (
        <EuiPopover
            initialFocus={`.euiPanel .euiFieldSearch.${fieldName}`}
            id={smallContextMenuPopoverId}
            button={<WfoHeaderCellContentButton />}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <WfoPopoverHeader />
            {isFilterable && (
                <>
                    <EuiHorizontalRule margin="none" />
                    <WfoPopoverContent />
                </>
            )}
        </EuiPopover>
    );
};
