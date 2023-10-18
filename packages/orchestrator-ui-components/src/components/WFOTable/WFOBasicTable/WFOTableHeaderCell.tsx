import React, { FC, ReactNode, useState } from 'react';

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
    sortOrder?: SortOrder;
    onSetSortOrder?: (updatedSortOrder: SortOrder) => void;
    isSortable?: boolean;
    children: ReactNode;
};

// Todo add dropdown logic here
export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
    sortOrder,
    children,
    isSortable = true,
    onSetSortOrder,
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

    const PopoverButton = () => (
        <button onClick={handleButtonClick}>
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
                    TODO: Column name
                </EuiText>
                <WFOSortButtons
                    sortOrder={sortOrder}
                    onChangeSortOrder={handleChangeSortOrder}
                />
            </div>
            <EuiHorizontalRule margin="none" />
            <div css={{ margin: 12 }}>
                <EuiFieldSearch
                    placeholder="Search"
                    // value={value}
                    // onChange={(e) => onChange(e)}
                    isClearable={false}
                />
            </div>
        </EuiPopover>
    );
};
