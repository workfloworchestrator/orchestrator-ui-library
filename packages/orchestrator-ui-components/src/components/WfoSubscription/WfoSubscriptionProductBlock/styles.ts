import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const productBlockIconStyle = css({
        width: 45,
        height: 45,
        backgroundColor: 'rgb(193,221,241,1)',
        paddingTop: 13,
        paddingLeft: 15,
        borderRadius: 7,
    });

    const productBlockPanelStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const productBlockRowStyle = css({
        '&:first-child': {
            borderTop: `solid 1px ${theme.colors.lightShade}`,
        },
    });

    const productBlockLeftColStyle = css({
        verticalAlign: 'top',
        width: 250,
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    const productBlockRightColStyle = css({
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    return {
        productBlockIconStyle,
        productBlockPanelStyle,
        productBlockLeftColStyle,
        productBlockRightColStyle,
        productBlockRowStyle,
    };
};
