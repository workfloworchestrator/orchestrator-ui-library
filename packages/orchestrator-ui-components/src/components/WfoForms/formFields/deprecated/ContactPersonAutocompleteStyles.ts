import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getContactPersonStyles = ({ theme }: WfoTheme) => {
    const contactPersonAutocompleteStyling = css`
        .autocomplete-container {
            position: relative;
        }

        section.autocomplete {
            position: relative;
            z-index: 2000;
            width: 100%;
            border-radius: ${theme.border.radius.medium};
            background-color: ${theme.colors.lightShade};
            margin-bottom: 20px;

            table.result {
                z-index: 2000;

                tbody tr {
                    cursor: pointer;

                    td {
                        padding: 10px;
                        width: 50%;
                        vertical-align: middle;
                        span.matched {
                            font-weight: bold;
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    `;
    return {
        contactPersonAutocompleteStyling,
    };
};
