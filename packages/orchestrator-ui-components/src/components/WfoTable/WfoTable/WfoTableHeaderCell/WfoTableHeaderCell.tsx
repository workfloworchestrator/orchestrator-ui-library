import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFieldSearch,
    EuiHorizontalRule,
    EuiPopover,
    EuiText,
    useGeneratedHtmlId,
} from '@elastic/eui';

import { WfoSortButtons } from '@/components';
import { getUpdatedSortOrder } from '@/components/WfoTable/WfoTable/utils';
import { useWithOrchestratorTheme } from '@/hooks';
import { SortOrder } from '@/types';

import { WfoSortDirectionIcon } from './WfoSortDirectionIcon';
import { getWfoBasicTableStyles } from './styles';

export type WfoTableHeaderCellProps = {
    fieldName: string;
    sortOrder?: SortOrder;
    onSetSortOrder?: (updatedSortOrder: SortOrder) => void;
    onSearch?: (searchText: string) => void;
    children: string;
};

export const WfoTableHeaderCell: FC<WfoTableHeaderCellProps> = ({
    fieldName,
    sortOrder,
    children,
    onSetSortOrder,
    onSearch,
}) => {
    const {
        headerCellStyle,
        getHeaderCellContentStyle,
        headerCellPopoverHeaderStyle,
        headerCellPopoverHeaderTitleStyle,
        headerCellPopoverContentStyle,
        sortButtonStyle,
    } = useWithOrchestratorTheme(getWfoBasicTableStyles);
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
            <div css={getHeaderCellContentStyle(shouldShowPopover)}>
                {children}
            </div>
        </button>
    );

    const WfoPopoverHeader = () => (
        <div css={headerCellPopoverHeaderStyle}>
            <EuiText size="xs" css={headerCellPopoverHeaderTitleStyle}>
                {children}
            </EuiText>
            {isSortable && (
                <WfoSortButtons
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
        <div css={headerCellStyle}>
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

            {isSortable && (
                <button
                    css={sortButtonStyle}
                    onClick={() =>
                        onSetSortOrder(getUpdatedSortOrder(sortOrder))
                    }
                >
                    <WfoSortDirectionIcon sortDirection={sortOrder} />
                </button>
            )}
        </div>
    );
};
