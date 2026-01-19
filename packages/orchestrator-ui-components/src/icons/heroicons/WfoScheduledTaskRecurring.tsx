import React, { FC } from 'react';

import { WfoIconProps } from '@/icons';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

export const WfoScheduledTaskRecurringSvg: FC<WfoIconProps> = ({
    width = 20,
    height = 20,
    color = 'currentColor',
}) => (
    <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="size-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
        />
    </svg>
);

export const WfoScheduledTaskRecurring = withWfoHeroIconsWrapper(
    WfoScheduledTaskRecurringSvg,
);
