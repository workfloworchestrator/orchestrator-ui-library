import React, { useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

type Props<T> = {
    data: T[];
    height: number;
    renderRow: (row: T, index: number) => React.ReactNode;
};

const ESTIMATED_ROW_HEIGHT = 44;
const OVERSCAN_COUNT = 10;

export const WfoVirtualizedTableBody = <T,>({
    data,
    height,
    renderRow,
}: Props<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ESTIMATED_ROW_HEIGHT,
        overscan: OVERSCAN_COUNT,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    const lastVirtualItemEnd =
        virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].end : 0;
    const virtualTopSpacerHeight = virtualItems[0]?.start ?? 0;
    const bottomSpacerHeight = totalSize - lastVirtualItemEnd;

    return (
        <div
            ref={parentRef}
            style={{
                height,
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <table style={{ width: '100%' }}>
                <tbody style={{ position: 'relative' }}>
                    <tr style={{ height: virtualTopSpacerHeight }} />

                    {virtualItems.map((virtualRow) =>
                        renderRow(data[virtualRow.index], virtualRow.index),
                    )}

                    <tr
                        style={{
                            height: bottomSpacerHeight,
                        }}
                    />
                </tbody>
            </table>
        </div>
    );
};
