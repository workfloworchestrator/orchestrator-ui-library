import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoShare: FC<WfoIconProps> = ({
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
        <title>icon/share</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/share" fill={color} fillRule="nonzero">
                <path
                    fillRule="evenodd"
                    d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                    clipRule="evenodd"
                    id="Combined-Shape"
                ></path>
            </g>
        </g>
    </svg>
);
