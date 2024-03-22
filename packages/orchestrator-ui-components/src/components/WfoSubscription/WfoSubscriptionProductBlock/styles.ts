import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const iconStyle = css({
        width: 45,
        height: 45,
        backgroundColor: 'rgb(193,221,241,1)',
        paddingTop: 13,
        paddingLeft: 15,
        borderRadius: 7,
    });

    const panelStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const rowStyle = css({
        '&:first-child': {
            borderTop: `solid 1px ${theme.colors.lightShade}`,
        },
    });

    const leftColumnStyle = css({
        verticalAlign: 'top',
        width: 250,
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    const rightColumnStyle = css({
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    return {
        iconStyle,
        panelStyle,
        leftColumnStyle,
        rightColumnStyle,
        rowStyle,
    };
};
