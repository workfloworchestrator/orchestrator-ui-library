import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWfoBasicTableStyles = ({ theme }: WfoTheme) => {
    const radius = theme.border.radius.medium;

    const basicTableStyle = css({
        table: {
            backgroundColor: theme.colors.emptyShade,
        },

        // The lines between rows
        'tr>td': {
            borderColor: theme.colors.lightShade,
        },

        '.euiTableCellContent__text': {
            display: 'flex',
            color: theme.colors.text,
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
        tbody: {
            'tr.euiTableRow:hover': {
                backgroundColor: theme.colors.lightestShade,
            },
        },
    });

    const getStatusColumnStyle = (columnNumber: number) =>
        css(basicTableStyle, {
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

    const dropDownTableStyle = css({
        thead: {
            backgroundColor: theme.colors.lightestShade,
            'tr>:first-child': {
                borderTopLeftRadius: 0,
            },
            'tr>:last-child': {
                borderTopRightRadius: 0,
            },
        },
        tbody: {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const expandableTableStyle = css([
        basicTableStyle,
        {
            'tr.euiTableRow-isExpandedRow': {
                backgroundColor: theme.colors.lightestShade,
            },
        },
    ]);

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
        dropDownTableStyle,
        expandableTableStyle,
    };
};
