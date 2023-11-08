import { css } from '@emotion/react';

// import { DANGER, SUCCESS } from "../../../stylesheets/emotion/colors";

// Todo fix colors
export const acceptFieldStyling = css`
    .accept-field {
        label.warning {
            //color: DANGER;
            color: red;
        }

        .skip {
            // color: SUCCESS;
            color: green;
            font-style: italic;
        }

        // Don't touch the margin + padding: they also control if the user can click on the checkbox instead of label
        .level_2 {
            margin-left: 24px;
            padding: 0;
            label {
                margin-top: 0;
            }
        }
    }
`;
