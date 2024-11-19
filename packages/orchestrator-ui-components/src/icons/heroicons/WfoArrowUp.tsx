import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

export const WfoArrowUpSvg: FC<WfoIconProps> = ({
    width = 12,
    height = 14,
    color = 'currentColor',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="4 3 12 14"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
            clipRule="evenodd"
        />
    </svg>
);

export const WfoArrowUp = withWfoHeroIconsWrapper(WfoArrowUpSvg);
