import React, { useState } from 'react';
import type { FC } from 'react';
import Draggable from 'react-draggable';
import type { DraggableEventHandler } from 'react-draggable';

import { useWithOrchestratorTheme } from '@/hooks';

import type { onUpdateColumWidth } from './WfoTableHeaderRow';
import { getWfoTableStyles } from './styles';

const MINIMUM_COLUMN_WIDTH = 50;

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
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const { dragAndDropStyle } = useWithOrchestratorTheme(getWfoTableStyles);

    const resetPosition = () => {
        setPosition({ x: 0, y: 0 });
    };

    const onStart: DraggableEventHandler = () => {
        setIsDragging(false);
    };

    const onDrag: DraggableEventHandler = (_, data) => {
        setIsDragging(true);
        setPosition({ x: data.x, y: data.y });
    };

    const onStop: DraggableEventHandler = (_, data) => {
        if (headerRowRef.current && isDragging) {
            const newWidth = startWidth + data.x;

            onUpdateColumWidth(
                fieldName,
                newWidth > MINIMUM_COLUMN_WIDTH
                    ? newWidth
                    : MINIMUM_COLUMN_WIDTH,
            );
            resetPosition();
            setIsDragging(false);
        }
    };

    const thElement =
        headerRowRef.current &&
        (headerRowRef.current.querySelector(
            `th[data-field-name="${fieldName}"]`,
        ) as HTMLTableCellElement);

    const startWidth =
        thElement?.getBoundingClientRect().width ?? MINIMUM_COLUMN_WIDTH;

    const bounds = {
        left: MINIMUM_COLUMN_WIDTH - startWidth,
        top: 0,
        bottom: 0,
    };

    return (
        <div>
            <Draggable
                allowAnyClick={false}
                axis="x"
                position={position}
                onStart={onStart}
                onDrag={onDrag}
                bounds={bounds}
                onStop={onStop}
            >
                <div css={dragAndDropStyle} />
            </Draggable>
        </div>
    );
};
