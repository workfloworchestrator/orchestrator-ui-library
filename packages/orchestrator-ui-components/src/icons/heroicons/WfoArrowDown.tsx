import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

export const WfoArrowDownSvg: FC<WfoIconProps> = ({
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
            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
            clipRule="evenodd"
        />
    </svg>
);

export const WfoArrowDown = withWfoHeroIconsWrapper(WfoArrowDownSvg);
