import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoBoltSlashFill: FC<WfoIconProps> = ({ width = 20, height = 20, color = '#000000' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>icon/bolt-fill</title>
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="icon/bolt-slash-fill" fill={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21"
          />
        </g>
      </g>
    </svg>
  );
};
