import React, { FC } from 'react';

import { WfoIconProps } from '@/icons/WfoIconProps';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

const WfoArrowsUpDownSvg: FC<WfoIconProps> = ({
    width = 20,
    height = 20,
    color = 'currentColor',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="2 2 20 20"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
        />
    </svg>
);

export const WfoArrowsUpDown = withWfoHeroIconsWrapper(WfoArrowsUpDownSvg);
