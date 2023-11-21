import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoEyeFill: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>icon/eye-fill</title>
            <g
                id="Symbols"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g id="icon/eye-fill" fill={color}>
                    <path
                        d="M11.542206,5 C16.019836,5 19.810136,7.94288 21.084436,11.99996 C19.810136,16.0571 16.019836,19 11.542186,19 C7.064556,19 3.274276,16.0571 2,12 C3.274256,7.94291 7.064556,5 11.542206,5 Z M11.542246,8 C9.333106,8 7.542246,9.79086 7.542246,12 C7.542246,14.2091 9.333106,16 11.542246,16 C13.751336,16 15.542246,14.2091 15.542246,12 C15.542246,9.79086 13.751336,8 11.542246,8 Z M11.542246,10 C12.646836,10 13.542236,10.89543 13.542236,12 C13.542236,13.1046 12.646836,14 11.542246,14 C10.437676,14 9.542246,13.1046 9.542246,12 C9.542246,10.89543 10.437676,10 11.542246,10 Z"
                        id="Combined-Shape"
                    ></path>
                </g>
            </g>
        </svg>
    );
};
