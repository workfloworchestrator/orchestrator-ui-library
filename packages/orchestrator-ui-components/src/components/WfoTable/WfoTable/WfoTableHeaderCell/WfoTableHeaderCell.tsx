import React, { FC, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFieldSearch,
    EuiForm,
    EuiFormRow,
    EuiHorizontalRule,
    EuiPopover,
    EuiText,
    useGeneratedHtmlId,
} from '@elastic/eui';

import { WfoSortDirectionIcon } from '@/components';
import { getUpdatedSortOrder } from '@/components/WfoTable/WfoTable/utils';
import { useWithOrchestratorTheme } from '@/hooks';
import { SortOrder } from '@/types';

import {
    HEADER_CELL_SORT_BUTTON_CLASS,
    HEADER_CELL_TITLE_BUTTON_CLASS,
    getWfoBasicTableStyles,
} from './styles';

export type WfoTableHeaderCellProps = {
    fieldName: string;
    sortOrder?: SortOrder;
    onSetSortOrder?: (updatedSortOrder: SortOrder) => void;
    onSearch?: (searchText: string) => void;
    children: string;
};

interface WfoPopoverContentProps {
    onSearch?: (searchText: string) => void;
    closePopover: () => void;
    fieldName: string;
}

export const WfoPopoverContent: FC<WfoPopoverContentProps> = ({
    onSearch,
    closePopover,
    fieldName,
}) => {
    const { headerCellPopoverContentStyle } = useWithOrchestratorTheme(
        getWfoBasicTableStyles,
    );
    const t = useTranslations('common');

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newValue = inputRef.current?.value || '';
        onSearch?.(newValue);
        if (inputRef.current) inputRef.current.value = '';
        closePopover();
    };

    return (
        <div css={headerCellPopoverContentStyle}>
            <EuiForm component="form" onSubmit={handleSubmit}>
                <EuiFormRow>
                    <EuiFieldSearch
                        className={fieldName}
                        placeholder={t('search')}
                        inputRef={(input) => {
                            inputRef.current = input;
                        }}
                        isClearable={false}
                        name={`search-${fieldName}`}
                    />
                </EuiFormRow>
            </EuiForm>
        </div>
    );
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
        getTitleButtonStyle,
        sortButtonStyle,
    } = useWithOrchestratorTheme(getWfoBasicTableStyles);

    const isSortable = !!onSetSortOrder;
    const isFilterable = !!onSearch;

    const smallContextMenuPopoverId = useGeneratedHtmlId({
        prefix: 'smallContextMenuPopover',
    });

    const [isPopoverOpen, setPopover] = useState(false);
    const handleButtonClick = () => setPopover(!isPopoverOpen);
    const closePopover = () => setPopover(false);

    const WfoHeaderCellContentButton = () => (
        <button onClick={handleButtonClick} disabled={!isFilterable}>
            <div css={getHeaderCellContentStyle(isFilterable)}>{children}</div>
        </button>
    );

    const WfoPopoverHeader = () => (
        <div css={headerCellPopoverHeaderStyle}>
            <EuiText size="xs" css={headerCellPopoverHeaderTitleStyle}>
                {children}
            </EuiText>
        </div>
    );

    return (
        <div css={headerCellStyle}>
            <EuiPopover
                className={HEADER_CELL_TITLE_BUTTON_CLASS}
                css={getTitleButtonStyle(sortOrder)}
                initialFocus={`.euiPanel .euiFieldSearch.${fieldName}`}
                id={smallContextMenuPopoverId}
                button={<WfoHeaderCellContentButton />}
                isOpen={isPopoverOpen}
                closePopover={closePopover}
                panelPaddingSize="none"
                anchorPosition="downLeft"
            >
                <WfoPopoverHeader />
                <EuiHorizontalRule margin="none" />
                <WfoPopoverContent
                    fieldName={fieldName}
                    onSearch={onSearch}
                    closePopover={closePopover}
                />
            </EuiPopover>

            {isSortable && (
                <button
                    className={HEADER_CELL_SORT_BUTTON_CLASS}
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
