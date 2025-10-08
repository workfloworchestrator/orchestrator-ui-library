import { css } from '@emotion/react';

export const imsPortIdFieldStyling = css`
    section.node-port {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        div.node-select {
            width: 50%;
        }
        div.port-select {
            width: 50%;
            padding-left: 5px;
        }
    }
`;
