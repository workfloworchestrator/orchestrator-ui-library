import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const radius = theme.border.radius.medium;

    const basicTableStyle = css({
        '.euiTableCellContent__text': {
            display: 'flex',
        },
        thead: {
            backgroundColor: theme.colors.lightShade,
            'tr>:first-child': {
                borderTopLeftRadius: radius,
            },
            'tr>:last-child': {
                borderTopRightRadius: radius,
            },
        },
        'tr.euiTableRow:hover': {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const getStatusColumnStyle = (columnNumber: number) =>
        css({
            [`tbody tr td:nth-child(${columnNumber}) .euiTableCellContent`]: {
                padding: 0,
                '.euiTableCellContent__text': {
                    flex: 1,
                    '> *': {
                        paddingBlock: theme.base * 1.25,
                    },
                },
            },
        });

    const headerCellContentStyle = css({
        fontWeight: theme.font.weight.semiBold,
    });

    const headerCellPopoverHeaderStyle = css({
        margin: theme.size.m,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    });

    const headerCellPopoverHeaderTitleStyle = css({
        fontWeight: theme.font.weight.medium,
    });

    const headerCellPopoverContentStyle = css({
        margin: theme.size.m,
    });

    const getHeaderCellButtonStyle = (isSortable: boolean) =>
        css({
            display: 'flex',
            alignItems: 'center',
            cursor: isSortable ? 'pointer' : 'not-allowed',
        });

    return {
        basicTableStyle,
        headerCellContentStyle,
        headerCellPopoverHeaderStyle,
        headerCellPopoverHeaderTitleStyle,
        headerCellPopoverContentStyle,
        getHeaderCellButtonStyle,
        getStatusColumnStyle,
    };
};
