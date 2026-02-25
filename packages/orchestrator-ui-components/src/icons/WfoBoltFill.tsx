import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoBoltFill: FC<WfoIconProps> = ({ width = 20, height = 20, color = '#000000' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>icon/bolt-fill</title>
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="icon/bolt-fill" fill={color}>
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
            clipRule="evenodd"
          />
        </g>
      </g>
    </svg>
  );
};
