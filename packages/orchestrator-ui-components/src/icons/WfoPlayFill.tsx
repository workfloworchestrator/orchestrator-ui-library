import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPlayFill: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>icon/play-fill</title>
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="icon/play-id" fill={color}>
          <path
            d="M12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 Z M11.5547,9.16795 C11.24784,8.96338 10.8533,8.94431 10.52814,9.11833 C10.20298,9.29235 10,9.63121 10,10.0000011 L10,14.0000011 C10,14.3688 10.20298,14.7077 10.52814,14.8817 C10.8533,15.0557 11.24784,15.0366 11.5547,14.8321 L14.5547,12.8321 C14.8329,12.6466 15,12.3344 15,12.0000011 C15,11.66565 14.8329,11.35342 14.5547,11.16795 L11.5547,9.16795 Z"
            id="Shape"
          ></path>
        </g>
      </g>
    </svg>
  );
};
