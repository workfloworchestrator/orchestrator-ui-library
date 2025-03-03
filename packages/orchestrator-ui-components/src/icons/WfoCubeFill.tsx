import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoCubeFill: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => (
    <svg
        width={width}
        height={height}
        viewBox={`0 0 24 24`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/cube-fill</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/cube-fill" fill={color}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill={color}
                        fillRule="evenodd"
                        d="M18.5257,10.38542 C18.8205,10.56762 19,10.88949 19,11.2360683 L19,17 C19,17.3788 18.786,17.725 18.4472,17.8944 L14.4472,19.8944 C14.1372,20.0494 13.7691,20.0329 13.4743,19.8507 C13.1795,19.6684 13,19.3466 13,19 L13,13.2361 C13,12.8573 13.214,12.511 13.5528,12.3416 L17.5528,10.34164 C17.8628,10.18665 18.2309,10.20321 18.5257,10.38542 Z M5.47427,10.38542 C5.76909,10.20321 6.13723,10.18665 6.44721,10.34164 L10.44721,12.3416 C10.786,12.511 11,12.8573 11,13.2361 L11,19 C11,19.3466 10.82055,19.6684 10.52573,19.8507 C10.23091,20.0329 9.86277,20.0494 9.55279,19.8944 L5.55279,17.8944 C5.214,17.725 5,17.3788 5,17 L5,11.2360683 C5,10.88949 5.17945,10.56762 5.47427,10.38542 Z M12.4472,4.10557 L17.2111,6.48754 C17.5499,6.65693 17.7639,7.00319 17.7639,7.38197 C17.7639,7.76074 17.5499,8.107 17.2111,8.27639 L12.4472,10.65836 C12.1657,10.79912 11.83431,10.79912 11.55279,10.65836 L6.78885,8.27639 C6.45007,8.107 6.23607,7.76074 6.23607,7.38197 C6.23607,7.00319 6.45007,6.65693 6.78885,6.48754 L11.55279,4.10557 C11.83431,3.96481 12.1657,3.96481 12.4472,4.10557 Z"
                    />
                </svg>
            </g>
        </g>
    </svg>
);
