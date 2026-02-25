import React, { FC } from 'react';

import { WfoIconProps } from '@/icons';

import { withWfoHeroIconsWrapper } from './WfoHeroIconsWrapper';

const WfoScheduledTaskOnceSvg: FC<WfoIconProps> = ({ width = 20, height = 20, color = 'currentColor' }) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    className="size-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const WfoScheduledTaskOnce = withWfoHeroIconsWrapper(WfoScheduledTaskOnceSvg);
