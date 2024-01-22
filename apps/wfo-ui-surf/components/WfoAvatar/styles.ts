import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (
    theme: EuiThemeComputed,
    toSecondaryColor: (color: string) => string,
) => {
    const stepStateIcon = {
        height: theme.size.xxl,
        width: theme.size.xxl,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: theme.size.l,
        border: `${theme.size.xxs} solid ${theme.colors.emptyShade}`,
    };

    const openIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.success),
        color: theme.colors.success,
    });

    const updateIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.primary),
        color: theme.colors.primary,
    });

    const closedIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.subduedText),
        color: theme.colors.subduedText,
    });

    return {
        closedIconStyle,
        updateIconStyle,
        openIconStyle,
    };
};
