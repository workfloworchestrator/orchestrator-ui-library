import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoChevronUp: FC<WfoIconProps> = ({
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
        <title>icon/chevron-up</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/chevron-up" fill={color}>
                <path
                    d="M16.7071,14.7071 C16.3166,15.0976 15.6834,15.0976 15.2929,14.7071 L12,11.41421 L8.70711,14.7071 C8.31658,15.0976 7.68342,15.0976 7.29289,14.7071 C6.90237,14.3166 6.90237,13.6834 7.29289,13.2929 L11.29289,9.29289 C11.68342,8.90237 12.3166,8.90237 12.7071,9.29289 L16.7071,13.2929 C17.0976,13.6834 17.0976,14.3166 16.7071,14.7071 Z"
                    id="Path"
                ></path>
            </g>
        </g>
    </svg>
);
