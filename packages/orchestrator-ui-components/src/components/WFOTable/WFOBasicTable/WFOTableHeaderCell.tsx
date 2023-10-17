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
import { WFOSortAsc, WFOSortDesc } from '../../../icons';
import { useOrchestratorTheme } from '../../../hooks';

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
    const handleClosePopover = () => setPopover(false);

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
            closePopover={handleClosePopover}
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
                    Title and controls
                </EuiText>
                <div css={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        css={{ display: 'flex', alignItems: 'center' }}
                        onClick={() =>
                            onSetSortOrder && onSetSortOrder(SortOrder.ASC)
                        }
                    >
                        <WFOSortAsc
                            color={
                                sortOrder === SortOrder.ASC
                                    ? theme.colors.title
                                    : theme.colors.lightShade
                            }
                        />
                    </button>
                    <button
                        css={{ display: 'flex', alignItems: 'center' }}
                        onClick={() =>
                            onSetSortOrder && onSetSortOrder(SortOrder.DESC)
                        }
                    >
                        <WFOSortDesc
                            color={
                                sortOrder === SortOrder.DESC
                                    ? theme.colors.title
                                    : theme.colors.lightShade
                            }
                        />
                    </button>
                </div>
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

// export const WFOTableHeaderCell: FC<WFOTableHeaderCellProps> = ({
//     sortDirection,
//     children,
//     onClick,
//     isSortable = true,
// }) => (
//     <div
//         css={{
//             display: 'flex',
//             alignItems: 'center',
//             cursor: isSortable ? 'pointer' : 'not-allowed',
//         }}
//         onClick={isSortable ? onClick : undefined}
//     >
//         <div>{children}</div>
//         {isSortable && sortDirection ? (
//             <WFOSortDirectionIcon sortDirection={sortDirection} />
//         ) : null}
//     </div>
// );
