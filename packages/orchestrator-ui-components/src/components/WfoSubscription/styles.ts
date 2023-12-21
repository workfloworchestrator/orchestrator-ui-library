import { tint } from '@elastic/eui';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

const toSecondaryColor = (color: string) => tint(color, 0.91);

export const getStyles = (theme: EuiThemeComputed) => {
    const contentCellStyle = {
        padding: (theme.base / 4) * 3,
        borderBottom: theme.border.thin,
    };

    const headerCellStyle = css({
        ...contentCellStyle,
        paddingLeft: 0,
        width: theme.base * 16,
        fontWeight: theme.font.weight.medium,
    });

    const emptyCellStyle = css({
        width: theme.base,
    });

    const tableStyle = css({
        backgroundColor: theme.colors.lightestShade,
        width: '100%',
        borderRadius: theme.border.radius.medium,
        marginTop: theme.base / 2,
    });

    const timeLineStyle = css({
        paddingLeft: theme.base / 2,
    });
    const workflowTargetStyle = css({ fontWeight: theme.font.weight.bold });

    const lastContentCellStyle = css({
        ...contentCellStyle,
        border: 0,
    });

    const lastHeaderCellStyle = css({
        padding: theme.base,
        paddingLeft: 0,
        width: 250,
        fontWeight: theme.font.weight.medium,
        border: 0,
    });

    const productBlockIconStyle = css({
        width: 45,
        height: 45,
        backgroundColor: 'rgb(193,221,241,1)',
        paddingTop: 13,
        paddingLeft: 15,
        borderRadius: 7,
    });

    const productBlockPanelStyle = css({
        backgroundColor: toSecondaryColor(theme.colors.primary),
    });

    const productBlockLeftCol = {
        width: 250,
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    };

    const productBlockLeftColStyle = css({ ...productBlockLeftCol });

    const productBlockFirstLeftColStyle = css({
        borderTop: `solid 1px ${theme.colors.lightShade}`,
        ...productBlockLeftCol,
    });

    const productBlockRightCol = {
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    };

    const productBlockRightColStyle = css({ ...productBlockRightCol });

    const productBlockFirstRightColStyle = css({
        borderTop: `solid 1px ${theme.colors.lightShade}`,
        ...productBlockRightCol,
    });

    return {
        contentCellStyle,
        headerCellStyle,
        tableStyle,
        timeLineStyle,
        workflowTargetStyle,
        emptyCellStyle,
        lastContentCellStyle,
        lastHeaderCellStyle,
        productBlockIconStyle,
        productBlockPanelStyle,
        productBlockLeftColStyle,
        productBlockFirstLeftColStyle,
        productBlockRightColStyle,
        productBlockFirstRightColStyle,
    };
};
