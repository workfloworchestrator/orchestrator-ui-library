import { UseEuiTheme } from '@elastic/eui';
import { css } from '@emotion/react';

export const getFilterDisplayStyles = (euiTheme: UseEuiTheme['euiTheme']) => ({
    wrap: css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: euiTheme.size.s,
    }),

    columnGroupWrap: css({
        display: 'flex',
        flexDirection: 'column',
        gap: euiTheme.size.s,
        alignItems: 'flex-start',
    }),

    chip: css({
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: euiTheme.size.xl,
        border: `1px solid ${euiTheme.border.color}`,
        background: euiTheme.colors.body,
        padding: `${euiTheme.size.s} ${euiTheme.size.m}`,
        lineHeight: 1.1,
        gap: euiTheme.size.s,
    }),

    group: css({
        border: `1px solid ${euiTheme.colors.borderBaseSubdued}`,
        borderRadius: euiTheme.border.radius.medium,
        padding: euiTheme.size.s,
        margin: euiTheme.size.xs,
        background: euiTheme.colors.body,
    }),

    operator: css({
        fontFamily: euiTheme.font.familyCode,
        padding: `${euiTheme.size.xs} ${euiTheme.size.s}`,
        borderRadius: euiTheme.size.s,
        background: euiTheme.colors.primary,
        color: euiTheme.colors.plainLight,
        fontSize: euiTheme.size.m,
        fontWeight: 'bold',
        margin: `${euiTheme.size.xs} 0`,
    }),

    value: css({
        fontWeight: 600,
        color: euiTheme.colors.warning,
    }),
});
