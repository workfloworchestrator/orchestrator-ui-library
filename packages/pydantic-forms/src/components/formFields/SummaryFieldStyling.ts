import { css } from "@emotion/core";
import {
    DARKEST_GREY,
    DARKEST_PRIMARY_COLOR,
    DARK_GREY_COLOR,
    LIGHT_GREY_COLOR,
    LIGHT_PRIMARY_COLOR,
    PRIMARY_COLOR,
} from "stylesheets/emotion/colors";

export const summaryFieldStyling = css`
    div.emailMessage {
        td {
            color: black;
        }
        p {
            color: black;
        }
        html {
            margin-left: -10px;
        }
    }

    section.table-summary {
        margin-top: 20px;
        width: 100%;

        td {
            padding: 10px;
            vertical-align: top;
        }

        td:not(:first-child):not(:last-child) {
            &.light {
                border-right: 1px solid ${LIGHT_GREY_COLOR};
            }
            &.dark {
                border-right: 1px solid ${DARK_GREY_COLOR};
            }
        }

        .label {
            font-weight: bold;
            &.light {
                background-color: ${LIGHT_PRIMARY_COLOR};
                border-right: solid 2px ${PRIMARY_COLOR};
            }
            &.dark {
                background-color: ${DARKEST_PRIMARY_COLOR};
                border-right: solid 2px ${LIGHT_PRIMARY_COLOR};
            }
        }
        .value {
            &.light {
                background-color: ${LIGHT_GREY_COLOR};
            }
            &.dark {
                background-color: ${DARKEST_GREY};
            }
        }
    }
`;
