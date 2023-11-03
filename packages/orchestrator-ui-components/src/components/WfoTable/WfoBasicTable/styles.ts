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

    const basicTableWithStatusColorColumn = css(
        {
            '.wfoBasicTable thead td': {
                paddingBlock: 8,
                paddingLeft: 8,
            },
            '.wfoBasicTable thead th': {
                paddingBlock: 8,
                paddingLeft: 8,
            },
            '.wfoBasicTable thead th button span:first-child': {
                padding: 0,
                border: 0,
            },
            '.wfoBasicTable tbody tr td div:first-child': {
                padding: 0,
                border: 0,
            },
            '.wfoBasicTable thead svg:not(.wfoArrowNarrowIcon)': {
                display: 'none',
            },
        },
        basicTableStyle,
    );

    return {
        basicTableStyle,
        basicTableWithStatusColorColumn,
        headerCellContentStyle,
        headerCellPopoverHeaderStyle,
        headerCellPopoverHeaderTitleStyle,
        headerCellPopoverContentStyle,
        getHeaderCellButtonStyle,
    };
};
