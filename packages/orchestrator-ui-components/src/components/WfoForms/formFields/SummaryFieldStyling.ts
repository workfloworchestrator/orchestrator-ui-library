import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const summaryFieldStyles = ({ theme }: WfoTheme) => {
    const summaryFieldStyle = css({
        'div.emailMessage': {
            td: {
                color: theme.colors.textParagraph,
            },
            p: {
                color: theme.colors.textParagraph,
            },
            html: {
                marginLeft: '-10px',
            },
        },
        'section.table-summary': {
            marginTop: '20px',
            width: '100%',
            td: {
                padding: '10px',
                verticalAlign: 'top',
            },
            'td:not(:first-child):not(:last-child)': {
                borderRight: `1px solid ${theme.colors.borderBasePlain}`,
            },
            '.label': {
                fontWeight: 'bold',
                color: theme.colors.backgroundBaseSubdued,
                backgroundColor: theme.colors.primary,
                borderRight: `2px solid ${theme.colors.borderBasePlain}`,
                borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
            },
            '.value': {
                backgroundColor: theme.colors.backgroundBasePrimary,
                borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
            },
        },
    });
    return {
        summaryFieldStyle: summaryFieldStyle,
    };
};
