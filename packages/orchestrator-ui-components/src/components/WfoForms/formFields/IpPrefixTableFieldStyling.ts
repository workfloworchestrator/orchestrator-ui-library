import { css } from '@emotion/react';

const DARK_GREY_COLOR = '#333333';
const LIGHTER_GREY_COLOR = '#999999';
const LIGHT_GOLD_COLOR = '#fca456';
const LIGHT_PRIMARY_COLOR = '#0da3f5';
const LIGHT_SUCCESS_COLOR = '#68ff1d';

function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(String((R * (100 + percent)) / 100));
    G = parseInt(String((G * (100 + percent)) / 100));
    B = parseInt(String((B * (100 + percent)) / 100));

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
        R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG =
        G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB =
        B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
}

export const ipPrefixTableFieldStyling = css`
    table.ip-blocks {
        word-break: break-all;
        margin-bottom: 20px;

        td,
        th {
            text-align: left;
        }
        tr {
            border-bottom: 1px solid ${LIGHTER_GREY_COLOR};
        }
        tr.Allocated {
            cursor: pointer;
            background-color: ${LIGHT_PRIMARY_COLOR};
            &:hover {
                background-color: ${shadeColor(LIGHT_PRIMARY_COLOR, -10)};
            }
        }
        tr.Planned {
            cursor: default;
            background-color: ${LIGHT_GOLD_COLOR};
        }
        tr.Free {
            cursor: pointer;
            background-color: ${LIGHT_SUCCESS_COLOR};
            &:hover {
                background-color: ${shadeColor(LIGHT_SUCCESS_COLOR, -10)};
            }
        }
        tr.Subnet {
            background-color: ${shadeColor(LIGHT_PRIMARY_COLOR, -30)};
            cursor: default;
        }
        tr.selected {
            background-color: ${DARK_GREY_COLOR};
            color: white;
            &:hover {
                background-color: black;
            }
        }
        thead {
            display: block;
            th {
                cursor: pointer;
                padding: 5px 5px 10px 5px;
            }
            th.id {
                min-width: 8em;
            }
            th.prefix {
                min-width: 15em;
            }
            th.description {
                width: 30em;
            }
            th.state {
                min-width: 25em;
            }
        }

        tbody {
            min-width: 1000px;
            height: 240px;
            display: block;
            overflow: auto;
            td {
                word-break: break-word;
                word-wrap: break-word;
                padding: 15px 5px;
            }
            td.id {
                min-width: 8em;
            }
            td.prefix {
                min-width: 15em;
            }
            td.description {
                width: 30em;
            }
            td.state {
                min-width: 25em;
            }
        }
    }
`;
