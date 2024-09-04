import { css } from '@emotion/react';
import { WfoTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { getWfoGroupedTableStyles } from '../WfoGroupedTable/styles';
import { getWfoTableStyles } from '../styles';
import { WIDTH_BUTTON_COLUMN } from './constants';

export const getWfoNestedTableStyles = (wfoTheme: WfoTheme) => {
    const { expandedRowStyle } = getWfoTableStyles(wfoTheme);
    const { innerTableHeaderStyle } = getWfoGroupedTableStyles(wfoTheme);

    const firstColumnLeftMarginStyle = css({
        '&:first-child > *:first-child': {
            marginLeft: WIDTH_BUTTON_COLUMN,
        },
    });

    const innerTableStyle = css({
        'thead > tr > th': [innerTableHeaderStyle, firstColumnLeftMarginStyle],
        'tbody > tr > td': [expandedRowStyle, firstColumnLeftMarginStyle],
    });

    return {
        innerTableStyle,
        firstColumnLeftMarginStyle,
    };
};
