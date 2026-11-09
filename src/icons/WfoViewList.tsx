import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoViewList: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} version="1.1" color={color} xmlns="http://www.w3.org/2000/svg">
    <title>icon/statistic</title>
    <path
      fill={color}
      fillRule="evenodd"
      d="M5,6 C5,5.44772 5.44772,5 6,5 L18,5 C18.5523,5 19,5.44772 19,6 C19,6.55228 18.5523,7 18,7 L6,7 C5.44772,7 5,6.55228 5,6 Z M5,10 C5,9.44772 5.44772,9 6,9 L18,9 C18.5523,9 19,9.44772 19,10 C19,10.55228 18.5523,11 18,11 L6,11 C5.44772,11 5,10.55228 5,10 Z M5,14 C5,13.4477 5.44772,13 6,13 L18,13 C18.5523,13 19,13.4477 19,14 C19,14.5523 18.5523,15 18,15 L6,15 C5.44772,15 5,14.5523 5,14 Z M5,18 C5,17.4477 5.44772,17 6,17 L18,17 C18.5523,17 19,17.4477 19,18 C19,18.5523 18.5523,19 18,19 L6,19 C5.44772,19 5,18.5523 5,18 Z"
    />
  </svg>
);
