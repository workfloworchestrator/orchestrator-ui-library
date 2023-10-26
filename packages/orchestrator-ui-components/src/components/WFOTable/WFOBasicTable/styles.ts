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

    const basicTableWithColorColumn = css(
        {
            '.euiTableHeaderCell': {
                paddingBlock: 8,
                paddingLeft: 8,
            },
            '.euiTableCellContent:first-child': {
                padding: 0,
                border: 0,
            },
            '.euiTableRowCell:first-child': {
                padding: 0,
            },
            '.euiTableSortIcon': {
                display: 'none',
            },
        },
        basicTableStyle,
    );

    return {
        basicTableStyle,
        basicTableWithColorColumn,
    };
};
