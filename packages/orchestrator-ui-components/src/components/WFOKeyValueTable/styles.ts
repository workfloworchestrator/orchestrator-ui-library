import { css, SerializedStyles } from '@emotion/react';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

export const getStyles = (theme: EuiThemeComputed) => {
    const padding = theme.font.baseline * 2;
    const radius = theme.border.radius.medium;

    const lightBackground = css({
        backgroundColor: theme.colors.emptyShade,
    });

    const darkBackground = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const keyColumnStyle = css({
        minWidth: 'fit-content',
        padding: padding,
        paddingRight: padding * 10,
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
    });

    const valueColumnStyle: SerializedStyles = css({
        padding: padding,
    });

    const copyColumnStyle: SerializedStyles = css({
        padding: padding,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        verticalAlign: 'middle',
    });

    const clickable: SerializedStyles = css({
        cursor: 'pointer',
    });

    return {
        keyColumnStyle,
        valueColumnStyle,
        copyColumnStyle,
        clickable,
        lightBackground,
        darkBackground,
    };
};
