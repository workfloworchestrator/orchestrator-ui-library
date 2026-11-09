import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoChartBar: FC<WfoIconProps> = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    version="1.1"
    color={color}
    xmlns="http://www.w3.org/2000/svg"
    className="wfoChartBarSquareIcon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      className="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
    </svg>
  </svg>
);
