import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPlayCircle: FC<WfoIconProps> = ({
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
        <title>icon/play-circle</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/play-circle" fill={color} fillRule="nonzero">
                <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                    clipRule="evenodd"
                    id="Combined-Shape"
                ></path>
            </g>
        </g>
    </svg>
);
