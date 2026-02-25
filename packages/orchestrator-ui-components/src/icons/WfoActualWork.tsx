import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoActualWork: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
    <path
      fill={color}
      fillRule="evenodd"
      d="M18.66,19.2 L20.1,19.2 C20.5970563,19.2 21,19.6029437 21,20.1 C21,20.5970563 20.5970563,21 20.1,21 L3.9,21 C3.40294373,21 3,20.5970563 3,20.1 C3,19.6029437 3.40294373,19.2 3.9,19.2 L5.34,19.2 L5.34,19.2 L9.98620437,3.71265211 C10.1130996,3.28966815 10.5024224,3 10.9440307,3 L13.0559693,3 C13.4975776,3 13.8869004,3.28966815 14.0137956,3.71265211 L18.66,19.2 L18.66,19.2 Z M15.78,15.6 L8.22,15.6 L7.14,19.2 L16.86,19.2 L15.78,15.6 Z M13.62,8.4 L10.38,8.4 L9.3,12 L14.7,12 L13.62,8.4 L13.62,8.4 Z"
    ></path>
  </svg>
);
