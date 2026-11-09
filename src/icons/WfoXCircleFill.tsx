import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoXCircleFill: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/x-circle-fill</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/x-circle-fill" fill={color}>
        <path
          d="M12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 Z M10.70711,9.29289 C10.31658,8.90237 9.68342,8.90237 9.29289,9.29289 C8.90237,9.68342 8.90237,10.31658 9.29289,10.70711 L10.58579,12 L9.29289,13.2929 C8.90237,13.6834 8.90237,14.3166 9.29289,14.7071 C9.68342,15.0976 10.31658,15.0976 10.70711,14.7071 L12,13.4142 L13.2929,14.7071 C13.6834,15.0976 14.3166,15.0976 14.7071,14.7071 C15.0976,14.3166 15.0976,13.6834 14.7071,13.2929 L13.4142,12 L14.7071,10.70711 C15.0976,10.31658 15.0976,9.68342 14.7071,9.29289 C14.3166,8.90237 13.6834,8.90237 13.2929,9.29289 L12,10.58579 L10.70711,9.29289 Z"
          id="Shape"
        ></path>
      </g>
    </g>
  </svg>
);
