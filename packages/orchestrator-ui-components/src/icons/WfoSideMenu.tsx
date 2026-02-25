import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoSideMenu: FC<WfoIconProps> = ({ width = 20, height = 20, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/sidemenu</title>
    <g id="Symbols" stroke="none" strokeWidth="6" fill="none">
      <g id="icon/sidemenu" stroke={color} transform="translate(-1.4305115e-6,0.00126457)">
        <path d="M 20.638709,3.2354373 20.962452,56.561712" id="path1"></path>
        <rect id="rect1" width="53.322857" height="53.326275" x="3.3385715" y="3.3373055" ry="11.207431"></rect>
      </g>
    </g>
  </svg>
);
