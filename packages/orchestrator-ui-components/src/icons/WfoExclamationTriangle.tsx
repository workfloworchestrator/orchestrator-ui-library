import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoExclamationTriangle: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
    >
        <title>icon/exclamation-circle</title>
        <g id="Symbols" strokeWidth="1.5" fill="currentColor">
            <g id="icon/exclamation-triangle" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                />
            </g>
        </g>
    </svg>
);
