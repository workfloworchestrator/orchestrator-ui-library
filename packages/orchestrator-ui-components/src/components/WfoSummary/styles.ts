import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getWfoSummaryCardsStyles = (theme: EuiThemeComputed) => {
    // Header
    const avatarStyle = css({
        maxHeight: theme.base * 3,
        maxWidth: theme.base * 3,
    });

    const totalSectionStyle = css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    });

    const valueStyle = css({
        fontSize: theme.size.l,
        fontWeight: theme.font.weight.semiBold,
    });

    // List
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

    // Cards
    const cardContainerStyle = css({
        height: theme.base * 36,
        minWidth: theme.base * 25,
    });

    return {
        avatarStyle,
        totalSectionStyle,
        valueStyle,
        ///
        listContainerStyle,
        listHeaderStyle,
        listStyle,
        ///
        listItemContainerStyle,
        listItemTitleStyle,
        listItemSubtitleStyle,
        listItemHighlightIconStyle,
        //
        cardContainerStyle,
    };
};
