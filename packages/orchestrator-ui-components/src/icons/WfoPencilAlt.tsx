import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPencilAlt: FC<WfoIconProps> = ({ width = 24, height = 24, color = '#000000' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon/pencil-alt</title>
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icon/pencil-alt" fill={color} fillRule="nonzero">
        <path
          d="M10,5.9999975 C10.55228,5.9999975 11,6.4477175 11,6.9999975 C11,7.5522775 10.55228,7.9999975 10,7.9999975 L6,7.9999975 L6,17.9999975 L16,17.9999975 L16,13.9999975 C16,13.4476975 16.4477,12.9999975 17,12.9999975 C17.5523,12.9999975 18,13.4476975 18,13.9999975 L18,17.9999975 C18,19.1045975 17.1046,19.9999975 16,19.9999975 L6,19.9999975 C4.89543,19.9999975 4,19.1045975 4,17.9999975 L4,7.9999975 C4,6.8954275 4.89543,5.9999975 6,5.9999975 L10,5.9999975 Z M16.5858,4.5857875 C17.3668,3.8047375 18.6332,3.8047375 19.4142,4.5857875 C20.1953,5.3668275 20.1953,6.6331575 19.4142,7.4142075 L11.82842,15 L9,15 L9,12.1715975 Z"
          id="Combined-Shape"
        ></path>
      </g>
    </g>
  </svg>
);
