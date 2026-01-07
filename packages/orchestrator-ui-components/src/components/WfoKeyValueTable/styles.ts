import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const padding = theme.font.baseline * 2.5;
    const clipboardIconMargin = theme.font.baseline * 2;
    const keyColumnWidth = theme.base * 12;
    const radius = theme.border.radius.medium;
    const clipboardIconSize = theme.base;

    const keyValueTable = css({
        display: 'grid',
        gridTemplateColumns: `${keyColumnWidth}px 1fr`,
    });

    const valueOnlyTable = css({
        display: 'block',
        gridTemplateColumns: `${keyColumnWidth}px 1fr`,
        '& > div': {
            padding: padding,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
        },
    });

    const lightBackground = css({
        backgroundColor: theme.colors.emptyShade,
    });

    const darkBackground = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const getBackgroundColorStyleForRow = (rowNumber: number) =>
        rowNumber % 2 ? lightBackground : darkBackground;

    const keyColumnStyle = css({
        padding: padding,
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
    });

    const valueColumnStyle = css({
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        paddingTop: theme.size.s,
        paddingBottom: theme.size.s,
        display: 'flex',
        alignItems: 'center',

        '&:hover > div': {
            visibility: 'visible',
        },
    });

    const keyCellStyle = css({
        fontWeight: theme.font.weight.medium,
        color: theme.colors.title,
    });

    const valueCellStyle = css({
        fontWeight: theme.font.weight.regular,
        color: theme.colors.text,
        display: 'flex',
        alignItems: 'center',
        overflowWrap: 'anywhere',
        whiteSpace: 'pre-wrap',
    });

    const clipboardIconStyle = css({
        visibility: 'hidden',
        height: `${clipboardIconSize}px`,
        paddingBottom: 0,
    });

    const clickableStyle = css({
        marginLeft: clipboardIconMargin,
        cursor: 'pointer',
        paddingRight: theme.size.s,
    });

    return {
        clipboardIconSize,
        keyValueTable,
        valueOnlyTable,
        keyColumnStyle,
        valueColumnStyle,
        keyCellStyle,
        valueCellStyle,
        clipboardIconStyle,
        clickableStyle,
        lightBackground,
        darkBackground,
        getBackgroundColorStyleForRow,
    };
};
