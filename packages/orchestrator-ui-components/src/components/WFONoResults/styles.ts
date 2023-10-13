import { css } from '@emotion/react';
import type { EuiThemeComputed } from '@elastic/eui';

export const getStyles = (theme: EuiThemeComputed) => {
    const panelStyle = css({
        display: 'flex',
        padding: theme.base * 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.base / 2,
        backgroundColor: theme.colors.body,
        borderRadius: theme.border.radius.medium,
        color: theme.colors.link,
        fontFamily: theme.font.family,
        marginTop: theme.base * 2,
    });

    return {
        panelStyle,
    };
};
