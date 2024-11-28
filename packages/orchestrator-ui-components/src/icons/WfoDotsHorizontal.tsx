import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

export const WfoDotsHorizontal: FC<WfoIconProps> = ({
    width = 20,
    height = 20,
    color = 'currentColor',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/dots-horizontal</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/dots-horizontal" fill={color} fillRule="nonzero">
                <path
                    d="M8,12 C8,13.1046 7.10457,14 6,14 C4.89543,14 4,13.1046 4,12 C4,10.89543 4.89543,10 6,10 C7.10457,10 8,10.89543 8,12 Z M14,12 C14,13.1046 13.1046,14 12,14 C10.89543,14 10,13.1046 10,12 C10,10.89543 10.89543,10 12,10 C13.1046,10 14,10.89543 14,12 Z M18,14 C19.1046,14 20,13.1046 20,12 C20,10.89543 19.1046,10 18,10 C16.8954,10 16,10.89543 16,12 C16,13.1046 16.8954,14 18,14 Z"
                    id="Combined-Shape"
                ></path>
            </g>
        </g>
    </svg>
);
