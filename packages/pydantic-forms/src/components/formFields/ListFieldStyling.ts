import { css } from "@emotion/core";

import { DANGER, LIGHT_GREY_COLOR, SUCCESS } from "../../../stylesheets/emotion/colors";

export const listFieldStyling = css`
    .list-field {
        ul {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }

        li {
            margin-top: -15px;
            list-style: none;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-left: 8px;

            // We use '>' because we don't want the outer list to influence the inner list
            > section {
                display: flex;
                flex-grow: 20;
                flex-direction: column;

                // We use '>' because we don't want the outer list to influence the inner list
                & > * {
                    display: flex;
                    flex-direction: column;
                    width: 99%;
                    margin-left: 5px;
                    &:first-of-type {
                        margin-left: 0;
                    }
                }
            }
        }
        div.add-item,
        div.del-item {
            display: flex;
            align-items: center;
            align-self: baseline;
            margin: 5px;
            margin-bottom: 30px;
            cursor: pointer;

            &[id$="0.remove"] {
                margin-top: 15px;
            }

            i.fa-plus {
                color: ${SUCCESS};
                font-size: 30px;
            }

            i.fa-minus {
                color: ${DANGER};
                font-size: 30px;
            }

            label {
                display: block;
                margin-left: 5px;
                cursor: pointer;
            }
            i.disabled {
                cursor: not-allowed;
                color: ${LIGHT_GREY_COLOR};
            }
        }
        .nest-field + div.del-item[id$="0.remove"] {
            margin-top: 33px;
        }

        div.del-item {
            margin-top: 13px;
        }

        div.add-item {
            align-self: flex-end;
        }

        // Used for nested lists (L2VPN)
        &.outer-list {
            // We use '>' because we don't want the outer list to influence the inner list
            > ul > div.add-item {
                align-self: flex-start;
                padding: 0 2px 0 0;
                align-items: center;
            }
            // We use '>' because we don't want the outer list to influence the inner list
            > ul > li > div.del-item {
                align-self: flex-start;
            }
            // We use '>' because we don't want the outer list to influence the inner list
            > ul > li {
                flex-direction: column;
            }
        }
    }
`;
