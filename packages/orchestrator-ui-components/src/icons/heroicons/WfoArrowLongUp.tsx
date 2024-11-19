import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

export const WfoArrowLongUpSvg: FC<WfoIconProps> = ({
    width = 8,
    height = 16,
    color = 'currentColor',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="6 2 8 16"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M10 18a.75.75 0 0 1-.75-.75V4.66L7.3 6.76a.75.75 0 0 1-1.1-1.02l3.25-3.5a.75.75 0 0 1 1.1 0l3.25 3.5a.75.75 0 1 1-1.1 1.02l-1.95-2.1v12.59A.75.75 0 0 1 10 18Z"
            clipRule="evenodd"
        />
    </svg>
);

export const WfoArrowLongUp = withWfoHeroIconsWrapper(WfoArrowLongUpSvg);
