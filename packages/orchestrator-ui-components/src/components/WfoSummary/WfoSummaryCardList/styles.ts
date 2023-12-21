import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getWfoSummaryCardListStyles = (theme: EuiThemeComputed) => {
    const listContainerStyle = css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
    });

    const listHeaderStyle = css({
        fontWeight: theme.font.weight.semiBold,
    });

    const listStyle = css({
        height: theme.base * 20,
        overflow: 'auto',
    });

    // ListItem
    const listItemContainerStyle = css({
        paddingBlock: 10,
        '.highlight-icon': {
            visibility: 'hidden',
        },
        '&:hover .highlight-icon': {
            visibility: 'visible',
        },
    });

    const listItemTitleStyle = css({
        fontWeight: 500,
    });

    const listItemSubtitleStyle = css({
        fontWeight: 400,
    });

    const listItemHighlightIconStyle = css({
        visibility: 'hidden',
    });

    return {
        listContainerStyle,
        listHeaderStyle,
        listStyle,
        listItemContainerStyle,
        listItemTitleStyle,
        listItemSubtitleStyle,
        listItemHighlightIconStyle,
    };
};
