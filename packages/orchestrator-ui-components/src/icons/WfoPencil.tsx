import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPencil: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
    >
        <path
            fill={color}
            d="M13.3787,7.7928875 L16.2071,10.6213175 L7.82842,18.9999975 L5,18.9999975 L5,16.1715975 L13.3787,7.7928875 Z M18.4142,5.5857875 C19.1953,6.3668275 19.1953,7.6331575 18.4142,8.4142075 L17.6213,9.2071075 L14.7929,6.3786775 L15.5858,5.5857875 C16.3668,4.8047375 17.6332,4.8047375 18.4142,5.5857875 Z"
        />
    </svg>
);
