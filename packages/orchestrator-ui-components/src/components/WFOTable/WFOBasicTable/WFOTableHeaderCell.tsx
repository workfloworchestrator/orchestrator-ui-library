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
import { useOrchestratorTheme } from '../../../hooks';
import { WFOSortButtons } from '../WFOSortButtons';

export type WFOTableHeaderCellProps = {
    fieldName: string;
    sortOrder?: SortOrder;
    isSortable?: boolean;
    onSetSortOrder?: (updatedSortOrder: SortOrder) => void;
    onSearch?: (searchText: string) => void;
    children: string;
};

export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
    fieldName,
    sortOrder,
    children,
    isSortable = true,
    onSetSortOrder,
    onSearch,
}) => {
    const { theme } = useOrchestratorTheme();
    const smallContextMenuPopoverId = useGeneratedHtmlId({
        prefix: 'smallContextMenuPopover',
    });

    const [isPopoverOpen, setPopover] = useState(false);
    const handleButtonClick = () => setPopover(!isPopoverOpen);
    const closePopover = () => setPopover(false);

    const handleChangeSortOrder = (updatedSortOrder: SortOrder) => {
        if (onSetSortOrder) {
            onSetSortOrder(updatedSortOrder);
            closePopover();
        }
    };

    const handleSearch = (searchText: string) => {
        if (onSearch) {
            onSearch(searchText);
            closePopover();
        }
    };

    const PopoverButton = () => (
        <button onClick={handleButtonClick} disabled={!isSortable}>
            <div
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: isSortable ? 'pointer' : 'not-allowed',
                }}
            >
                <div css={{ fontWeight: theme.font.weight.semiBold }}>
                    {children}
                </div>
                {sortOrder && (
                    <WFOSortDirectionIcon sortDirection={sortOrder} />
                )}
            </div>
        </button>
    );

    return (
        <EuiPopover
            initialFocus={`.euiPanel .euiFieldSearch.${fieldName}`}
            id={smallContextMenuPopoverId}
            button={<PopoverButton />}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <div
                css={{
                    margin: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <EuiText
                    size="xs"
                    css={{ fontWeight: theme.font.weight.medium }}
                >
                    {children}
                </EuiText>
                <WFOSortButtons
                    sortOrder={sortOrder}
                    onChangeSortOrder={handleChangeSortOrder}
                />
            </div>
            <EuiHorizontalRule margin="none" />
            <div css={{ margin: 12 }}>
                <EuiFieldSearch
                    className={fieldName}
                    placeholder="Search"
                    onSearch={handleSearch}
                    isClearable={false}
                />
            </div>
        </EuiPopover>
    );
};
