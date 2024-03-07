import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoWarningTriangle: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => (
    <svg
        width={width}
        height={height}
        viewBox={`0 0 24 24`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/exclamation-triangle</title>
        <g id="Symbols" stroke={color} strokeWidth="1.5" fill="none">
            <g id="icon/exclamation-triangle" fill="none">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
            </g>
        </g>
    </svg>
);
