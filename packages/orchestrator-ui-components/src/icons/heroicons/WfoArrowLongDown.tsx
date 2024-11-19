import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

export const WfoArrowLongDownSvg: FC<WfoIconProps> = ({
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
            d="M10 2a.75.75 0 0 1 .75.75v12.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 1 1 1.1-1.02l1.95 2.1V2.75A.75.75 0 0 1 10 2Z"
            clipRule="evenodd"
        />
    </svg>
);

export const WfoArrowLongDown = withWfoHeroIconsWrapper(WfoArrowLongDownSvg);
