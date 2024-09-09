import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoXMarkSmall: FC<WfoIconProps> = ({
    width = 20,
    height = 20,
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 -2 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/x-mark</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </g>
        </g>
    </svg>
);
