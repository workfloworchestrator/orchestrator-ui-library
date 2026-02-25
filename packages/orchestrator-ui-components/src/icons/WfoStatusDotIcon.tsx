import React from 'react';
import { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoStatusDotIcon: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/statusdot</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/statusdot" fill={color} fillRule="nonzero">
        <circle id="Oval" opacity="0.25" cx="12" cy="12" r="8"></circle>
        <circle id="Oval" cx="12" cy="12" r="4"></circle>
      </g>
    </g>
  </svg>
);
