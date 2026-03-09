import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoCubeSolid: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox={`0 0 24 24`} version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/cube-solid</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/cube-solid" fill={color} fillRule="nonzero">
        <path
          d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z"
          id="Combined-Shape"
        ></path>
      </g>
    </g>
  </svg>
);
