import { tint } from '@elastic/eui';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const toShadeColor = (color: string) => tint(color, 0.9);

    const summaryFieldStyle = css({
        'div.emailMessage': {
            td: {
                color: theme.colors.text,
            },
            p: {
                color: theme.colors.text,
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
                borderRight: `1px solid ${theme.colors.lightestShade}`,
            },
            '.label': {
                fontWeight: 'bold',
                color: theme.colors.lightestShade,
                backgroundColor: theme.colors.primary,
                borderRight: `2px solid ${theme.colors.lightestShade}`,
                borderBottom: `1px solid ${theme.colors.lightestShade}`,
            },
            '.value': {
                backgroundColor: toShadeColor(theme.colors.primary),
                borderBottom: `1px solid ${theme.colors.lightestShade}`,
            },
        },
    });
    return {
        summaryFieldStyle: summaryFieldStyle,
    };
};
