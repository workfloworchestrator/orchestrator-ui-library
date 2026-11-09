import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPlusCircleFill: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/plus-circle-fill</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/plus-circle-fill" fill={color}>
        <path
          d="M12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 Z M13,9 C13,8.44772 12.5523,8 12,8 C11.44772,8 11,8.44772 11,9 L11,11 L9,11 C8.44772,11 8,11.44771 8,12 C8,12.5523 8.44772,13 9,13 L11,13 L11,15 C11,15.5523 11.44772,16 12,16 C12.5523,16 13,15.5523 13,15 L13,13 L15,13 C15.5523,13 16,12.5523 16,12 C16,11.44772 15.5523,11 15,11 L13,11 L13,9 Z"
          id="Shape"
        ></path>
      </g>
    </g>
  </svg>
);
