import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoExternalLink: FC<WfoIconProps> = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/external-link</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/external-link" fill={color}>
        <path d="M10,7 C10.55228,7 11,7.44772 11,8 C11,8.55228 10.55228,9 10,9 L7,9 L7,17 L15,17 L15,14 C15,13.4477 15.4477,13 16,13 C16.5523,13 17,13.4477 17,14 L17,17 C17,18.1046 16.1046,19 15,19 L7,19 C5.89543,19 5,18.1046 5,17 L5,9 C5,7.89543 5.89543,7 7,7 Z M18,5 C18.5523,5 19,5.44772 19,6 L19,11 C19,11.55228 18.5523,12 18,12 C17.4477,12 17,11.55228 17,11 L17,8.41421 L10.70711,14.7071 C10.31658,15.0976 9.68342,15.0976 9.29289,14.7071 C8.90237,14.3166 8.90237,13.6834 9.29289,13.2929 L15.5858,7 L13,7 C12.4477,7 12,6.55228 12,6 C12,5.44772 12.4477,5 13,5 Z" />
      </g>
    </g>
  </svg>
);
