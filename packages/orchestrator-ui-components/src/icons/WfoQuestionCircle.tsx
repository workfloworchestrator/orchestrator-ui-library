import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoQuestionCircle: FC<WfoIconProps> = ({
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
        <title>icon/questionInCircle</title>
        <g
            id="Symbols"
            stroke={color}
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/play-circle" fill="none" fillRule="nonzero">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
            </g>
        </g>
    </svg>
);
