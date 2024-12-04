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

    const onDrag: DraggableEventHandler = (_, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    const resetPosition = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { dragAndDropStyle } = useWithOrchestratorTheme(getWfoTableStyles);

    return (
        <div>
            <Draggable
                axis="x"
                position={position}
                onDrag={onDrag}
                bounds="thead"
                onStop={(_, data) => {
                    if (headerRowRef.current) {
                        const thElement = headerRowRef.current.querySelector(
                            `th[data-field-name="${fieldName}"]`,
                        ) as HTMLTableCellElement;
                        const startWidth =
                            thElement.getBoundingClientRect().width;
                        const newWidth = startWidth + data.x;

                        onUpdateColumWidth(
                            fieldName,
                            newWidth > MINIMUM_COLUMN_WIDTH
                                ? newWidth
                                : MINIMUM_COLUMN_WIDTH,
                        );
                        resetPosition();
                    }
                }}
            >
                <div css={dragAndDropStyle} />
            </Draggable>
        </div>
    );
};
