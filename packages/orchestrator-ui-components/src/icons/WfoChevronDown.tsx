import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoChevronDown: FC<WfoIconProps> = ({
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
    >
        <title>icon/chevron-down</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/chevron-down" fill={color}>
                <path
                    d="M7.29289,9.29289 C7.68342,8.90237 8.31658,8.90237 8.70711,9.29289 L12,12.5858 L15.2929,9.29289 C15.6834,8.90237 16.3166,8.90237 16.7071,9.29289 C17.0976,9.68342 17.0976,10.31658 16.7071,10.70711 L12.7071,14.7071 C12.3166,15.0976 11.68342,15.0976 11.29289,14.7071 L7.29289,10.70711 C6.90237,10.31658 6.90237,9.68342 7.29289,9.29289 Z"
                    id="Path"
                ></path>
            </g>
        </g>
    </svg>
);
