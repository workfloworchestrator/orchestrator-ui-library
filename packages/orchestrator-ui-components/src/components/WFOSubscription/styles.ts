import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const contentCellStyle = {
        padding: theme.base,
        borderBottom: theme.border.thin,
    };

    const headerCellStyle = css({
        ...contentCellStyle,
        width: '250px',
        fontWeight: theme.font.weight.bold,
    });

    const tableStyle = css({
        backgroundColor: theme.colors.lightestShade,
        width: '100%',
    });

    return {
        contentCellStyle,
        headerCellStyle,
        tableStyle,
    };
};
