import { CSSProperties } from 'react';

import { css, keyframes } from '@emotion/react';

import { WfoTheme } from '@/hooks';

import {
    HEADER_CELL_TITLE_BUTTON_CLASS,
    SORTABLE_ICON_CLASS,
} from './WfoTableHeaderCell/styles';
import { TABLE_ROW_HEIGHT } from './constants';

export const getWfoTableStyles = ({ theme, isDarkThemeActive }: WfoTheme) => {
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
        position: 'relative',
    });

    const dataRowStyle = css({
        '&:hover': {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const expandedRowStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const sortableHeaderCellStyle = css({
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
        width: '100%',
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

    const headerCellContainer = css({
        display: 'flex',
        justifyContent: 'space-between',
        height: TABLE_ROW_HEIGHT,
    });

    const dragAndDropStyle = css({
        width: theme.size.xs,
        cursor: 'col-resize',
        borderRadius: theme.border.radius.small,
        position: 'absolute',
        height: '100%',
        zIndex: theme.levels.menu,
        '&:active, &:focus': {
            transition: 'background-color 0.15s',
            backgroundColor: isDarkThemeActive
                ? theme.colors.mediumShade
                : theme.colors.header,
        },
        '&::after': {
            display: 'flex',
            paddingTop: theme.base - (theme.base / 16) * 2,
            content: `"|"`, // Inserts a vertical line
            fontSize: theme.size.m,
            color: theme.colors.mediumShade,
            cursor: 'col-resize',
            opacity: 0.6,
            zIndex: theme.levels.navigation,
        },
        '&:active::after': {
            transition: 'opacity 0.15s',
            opacity: 0,
        },
    });

    const paginationStyle = css({
        '.eui-xScroll': { display: 'flex', justifyContent: 'flex-start' },
    });

    return {
        tableContainerStyle,
        tableStyle,
        headerStyle,
        headerCellContainer,
        bodyLoadingStyle,
        rowStyle,
        dataRowStyle,
        expandedRowStyle,
        sortableHeaderCellStyle,
        cellStyle,
        cellContentStyle,
        emptyTableMessageStyle,
        clickableStyle,
        dragAndDropStyle,
        paginationStyle,
        setWidth,
    };
};
