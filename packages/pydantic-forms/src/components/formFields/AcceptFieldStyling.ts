import { css } from "@emotion/core";

import { DANGER, SUCCESS } from "../../../stylesheets/emotion/colors";

export const acceptFieldStyling = css`
    .accept-field {
        label.warning {
            color: ${DANGER};
        }

        .skip {
            color: ${SUCCESS};
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
