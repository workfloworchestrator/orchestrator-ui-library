import { css } from '@emotion/react';

// Todo: theme with decent colors from theme (style was copied from v1)
const PRIMARY_COLOR = '#0077cc';

export const userInputFormStyling = css`
    .user-input-form {
        h3 {
            padding: 20px 0;
            font-size: larger;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .form-input {
            margin: 20px 0;

            padding-bottom: 20px;

            em {
                margin-bottom: 1px;
            }

            &.first_lightpath,
            &.second_lightpath,
            p.label {
                text-transform: uppercase;
                font-weight: bold;
                color: ${PRIMARY_COLOR};
            }

            &.downgrade_redundant_lp_choice,
            &.service_ports_primary,
            &.service_ports_secondary {
                margin-left: 40px;
            }

            b {
                // styles the arrows of numeric input
                margin-top: 4px;
                margin-left: 1px;
            }
        }

        section.form-errors {
            padding-bottom: 20px;
        }

        .actions {
            display: flex;
            margin-top: 25px;

            .notes {
                display: flex;
                align-items: center;
                flex-grow: 2;
            }

            label {
                margin-right: 10px;
            }
        }
    }

    /* EUI specific styling for the forms */

    .euiFormRow {
        margin-bottom: 26px; // For service ports this add margin to the label??
    }

    .euiFormRow__labelWrapper {
        flex-direction: column;
        margin-top: -10px;
    }

    .euiFormRow__label__large {
        font-size: +1.1em;
        margin-bottom: 0;
    }
`;
