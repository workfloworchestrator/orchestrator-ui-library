import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoStatistic: FC<WfoIconProps> = ({
    width = 20,
    height = 20,
    color = '#000000',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        version="1.1"
        color={color}
        xmlns="http://www.w3.org/2000/svg"
        className="wfoStatisticIcon"
    >
        <title>icon/statistic</title>
        <g xmlns="http://www.w3.org/2000/svg">
            <path
                fill={color}
                fillRule="nonzero"
                d="M17.5,4 C16.6715729,4 16,4.67157288 16,5.5 L16,18.5 C16,19.3284271 16.6715729,20 17.5,20 L18.5,20 C19.3284271,20 20,19.3284271 20,18.5 L20,5.5 C20,4.67157288 19.3284271,4 18.5,4 L17.5,4 L17.5,4 Z"
                opacity=".88"
            />
            <path
                fill={color}
                fillRule="nonzero"
                d="M11.5,8 C10.6715729,8 10,8.67157288 10,9.5 L10,18.5 C10,19.3284271 10.6715729,20 11.5,20 L12.5,20 C13.3284271,20 14,19.3284271 14,18.5 L14,9.5 C14,8.67157288 13.3284271,8 12.5,8 L11.5,8 Z"
                opacity=".66"
            />
            <path
                fill={color}
                fillRule="nonzero"
                d="M5.5,12 C4.67157288,12 4,12.6715729 4,13.5 L4,18.5 C4,19.3284271 4.67157288,20 5.5,20 L6.5,20 C7.32842712,20 8,19.3284271 8,18.5 L8,13.5 C8,12.6715729 7.32842712,12 6.5,12 L5.5,12 Z"
                opacity=".33"
            />
        </g>
    </svg>
);
