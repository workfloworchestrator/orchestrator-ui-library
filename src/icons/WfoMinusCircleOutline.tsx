import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoMinusCircleOutline: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/minus-circle-outline" fill={color} fillRule="nonzero">
        <path
          d="M12,4 C16.4183,4 20,7.58172 20,12 C20,16.4183 16.4183,20 12,20 C7.58172,20 4,16.4183 4,12 C4,7.58172 7.58172,4 12,4 Z M12,6 C8.6862895,6 6,8.6862895 6,12 C6,15.3137228 8.68628182,18 12,18 C15.3137305,18 18,15.3137305 18,12 C18,8.68628182 15.3137228,6 12,6 Z M15,11 C15.5523,11 16,11.44772 16,12 C16,12.5523 15.5523,13 15,13 L9,13 C8.44772,13 8,12.5523 8,12 C8,11.44772 8.44772,11 9,11 Z"
          id="Combined-Shape"
        ></path>
      </g>
    </g>
  </svg>
);
