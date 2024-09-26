import { css } from '@emotion/react';

import { SORTABLE_ICON_CLASS } from '@/components';
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

    const headerCellStyle = css({
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    });

    const getHeaderCellContentStyle = (isSortable: boolean) =>
        css({
            cursor: isSortable ? 'pointer' : 'not-allowed',
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

    const sortButtonStyle = css({
        display: 'flex',
        alignItems: 'center',
        [`&:focus-visible .${SORTABLE_ICON_CLASS}`]: {
            visibility: 'visible',
        },
    });

    return {
        basicTableStyle,
        headerCellStyle,
        getHeaderCellContentStyle,
        headerCellPopoverHeaderStyle,
        headerCellPopoverHeaderTitleStyle,
        headerCellPopoverContentStyle,
        sortButtonStyle,
        getStatusColumnStyle,
        dropDownTableStyle,
        expandableTableStyle,
    };
};
