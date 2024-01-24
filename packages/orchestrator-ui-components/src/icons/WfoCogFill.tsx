import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoCogFill: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    xPosition = 0,
    yPosition = 0,
}) => (
    <svg
        width={width}
        height={height}
        viewBox={`${xPosition} ${yPosition} ${width} ${height}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/cog-fill</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/cog-fill" fill="currentColor">
                <path
                    d="M9.4891975,1.1709375 C9.1101975,-0.3903125 6.8897975,-0.3903125 6.5107775,1.1709375 C6.2659375,2.1794875 5.1104475,2.6581075 4.2241575,2.1180875 C2.8521775,1.2821175 1.2821175,2.8521775 2.1180875,4.2241575 C2.6581075,5.1104475 2.1794875,6.2659275 1.1709375,6.5107775 C-0.3903125,6.8897975 -0.3903125,9.1101975 1.1709375,9.4891975 C2.1794875,9.7340975 2.6581075,10.8895975 2.1180875,11.7757975 C1.2821175,13.1477975 2.8521775,14.7178975 4.2241675,13.8818975 C5.1104475,13.3418975 6.2659375,13.8204975 6.5107775,14.8290975 C6.8897975,16.3902975 9.1101975,16.3902975 9.4891975,14.8290975 C9.7340975,13.8204975 10.8895975,13.3418975 11.7757975,13.8818975 C13.1477975,14.7178975 14.7178975,13.1477975 13.8818975,11.7757975 C13.3418975,10.8895975 13.8204975,9.7340975 14.8290975,9.4891975 C16.3902975,9.1101975 16.3902975,6.8897975 14.8290975,6.5107775 C13.8204975,6.2659275 13.3418975,5.1104475 13.8818975,4.2241575 C14.7178975,2.8521775 13.1477975,1.2821175 11.7757975,2.1180875 C10.8895975,2.6581075 9.7340975,2.1794875 9.4891975,1.1709375 Z M7.9999975,10.9999975 C9.6568975,10.9999975 10.9999975,9.6568975 10.9999975,7.9999975 C10.9999975,6.3431475 9.6568975,4.9999975 7.9999975,4.9999975 C6.3431475,4.9999975 4.9999975,6.3431475 4.9999975,7.9999975 C4.9999975,9.6568975 6.3431475,10.9999975 7.9999975,10.9999975 Z"
                    id="Shape"
                ></path>
            </g>
        </g>
    </svg>
);
