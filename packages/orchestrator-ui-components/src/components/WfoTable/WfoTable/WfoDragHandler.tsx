import React from 'react';
import type { FC } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import type { onUpdateColumWidth } from './WfoTableHeaderRow';
import { getWfoTableStyles } from './styles';

interface WfoDragHandlerProps {
    headerRowRef: React.RefObject<HTMLTableRowElement>;
    fieldName: string;
    onUpdateColumWidth: onUpdateColumWidth;
}

export const WfoDragHandler: FC<WfoDragHandlerProps> = ({
    headerRowRef,
    fieldName,
    onUpdateColumWidth,
}) => {
    const { dragAndDropStyle } = useWithOrchestratorTheme(getWfoTableStyles);
    let startDragPosition: number;
    let startWidth: number;

    return (
        <div
            css={dragAndDropStyle}
            draggable={true}
            onDragStart={(e) => {
                startDragPosition = e.clientX;
                if (headerRowRef.current) {
                    const thElement = headerRowRef.current.querySelector(
                        `th[data-field-name="${fieldName}"]`,
                    ) as HTMLTableCellElement;
                    startWidth = thElement.getBoundingClientRect().width;
                }
            }}
            onDragEnd={(e) => {
                const travel = e.clientX - startDragPosition;
                const newWidth = startWidth + travel;

                onUpdateColumWidth(fieldName, newWidth > 50 ? newWidth : 50);
            }}
        >
            &nbsp;
        </div>
    );
};
