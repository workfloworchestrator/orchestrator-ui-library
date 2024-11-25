import { CSSProperties } from 'react';

import { css, keyframes } from '@emotion/react';

import { WfoTheme } from '@/hooks';

import {
    HEADER_CELL_TITLE_BUTTON_CLASS,
    SORTABLE_ICON_CLASS,
} from './WfoTableHeaderCell/styles';
import { TABLE_ROW_HEIGHT } from './constants';

export const getWfoTableStyles = ({ theme }: WfoTheme) => {
    const radius = theme.border.radius.medium;

    const tableLoadingLineKeyframes = keyframes({
        from: {
            left: 0,
            width: 0,
        },
        '20%': {
            left: 0,
            width: '40%',
        },
        '80%': {
            left: '60%',
            width: '40%',
        },
        '100%': {
            left: '100%',
            width: 0,
        },
    });

    const tableContainerStyle = css({
        overflowX: 'auto',
    });

    const tableStyle = css({
        width: '100%',
    });

    const headerStyle = css({
        backgroundColor: theme.colors.lightShade,
        fontSize: theme.size.m,
        textAlign: 'left',
        'tr>:first-child': {
            borderTopLeftRadius: radius,
        },
        'tr>:last-child': {
            borderTopRightRadius: radius,
        },
    });

    const bodyLoadingStyle = css({
        position: 'relative',
        overflow: 'hidden',

        '&::before': {
            position: 'absolute',
            content: '""',
            height: theme.border.width.thick,
            backgroundColor: theme.colors.primary,
            animation: `${tableLoadingLineKeyframes} 1s linear infinite`,
        },
    });

    const rowStyle = css({
        height: TABLE_ROW_HEIGHT,
        borderStyle: 'solid',
        borderWidth: '0 0 1px 0',
        borderColor: theme.colors.lightShade,
    });

    const dataRowStyle = css({
        '&:hover': {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const expandedRowStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const headerCellStyle = css({
        paddingRight: 0,
        [`&:hover`]: {
            [`.${SORTABLE_ICON_CLASS}`]: {
                visibility: 'visible',
            },
            [`.${HEADER_CELL_TITLE_BUTTON_CLASS}`]: {
                overflow: 'hidden',
            },
        },
    });

    const cellStyle = css({
        paddingLeft: theme.size.m,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
    });

    const cellContentStyle = css({
        display: 'inline-block',
    });

    const emptyTableMessageStyle = css({
        textAlign: 'center',
    });

    const clickableStyle = css({
        cursor: 'pointer',
    });

    const setWidth = (width?: CSSProperties['width']) =>
        width !== undefined &&
        css({
            width: width,
            minWidth: width,
            maxWidth: width,
            overflow: 'hidden',
        });

    return {
        tableContainerStyle,
        tableStyle,
        headerStyle,
        bodyLoadingStyle,
        rowStyle,
        dataRowStyle,
        expandedRowStyle,
        headerCellStyle,
        cellStyle,
        cellContentStyle,
        emptyTableMessageStyle,
        clickableStyle,
        setWidth,
    };
};
