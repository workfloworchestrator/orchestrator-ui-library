import { css } from '@emotion/react';

export const subscriptionFieldStyling = css`
    .subscription-field {
        > div {
            display: flex;

            .subscription-field-select {
                width: 100%;
                margin-left: 5px;
            }
        }

        .euiFormRow > .euiFormRow__fieldWrapper > div {
            display: flex;
        }
    }

    // Setup sensible margins for port selectors
    .subscription-field-disabled {
        > div {
            display: flex;
            .subscription-field-select {
                margin-left: 0px;
                margin-top: 5px;
            }
        }
    }

    .reload-subscriptions-icon-button {
        margin-left: -7px;
    }
`;
