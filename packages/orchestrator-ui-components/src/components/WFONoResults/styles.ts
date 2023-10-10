import { css } from '@emotion/react';
import type { EuiThemeComputed } from '@elastic/eui';

export const getStyles = (theme: EuiThemeComputed, toSecondaryColor: (color: string) => string) => {
    const panelStyle = css({
        display: "flex",
        padding: theme.base * 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: toSecondaryColor(theme.colors.primary),
        borderRadius: theme.border.radius.medium,
        color: theme.colors.link,
        fontFamily: theme.font.family
      })

    return {
      panelStyle
    };
};
