import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoCheckmarkCircleFill: FC<WfoIconProps> = ({
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
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/checkmark-circle-fill" fill={color}>
                <path
                    d="M12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 Z M15.7071,10.70711 C16.0976,10.31658 16.0976,9.68342 15.7071,9.29289 C15.3166,8.90237 14.6834,8.90237 14.2929,9.29289 L11,12.5858 L9.70711,11.29289 C9.31658,10.90237 8.68342,10.90237 8.29289,11.29289 C7.90237,11.68342 7.90237,12.3166 8.29289,12.7071 L10.29289,14.7071 C10.68342,15.0976 11.31658,15.0976 11.70711,14.7071 L15.7071,10.70711 Z"
                    id="Shape"
                ></path>
            </g>
        </g>
    </svg>
);
