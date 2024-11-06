import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

const EXPANDED_CONTENT_LEFT_MARGIN = '52px';

export const getSubscriptionActionStyles = ({ theme }: WfoTheme) => {
    const expandableMenuItemStyle = css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover, & :hover': {
            cursor: 'pointer',
        },
    });

    const expandButtonStyle = css({
        marginRight: theme.size.m,
    });

    const expandedContentStyle = css({
        marginLeft: EXPANDED_CONTENT_LEFT_MARGIN,
        paddingBottom: theme.size.m,
        paddingRight: theme.size.m,
    });

    const linkStyle = css({
        display: 'block',
    });

    return {
        expandableMenuItemStyle,
        expandButtonStyle,
        expandedContentStyle,
        linkStyle,
    };
};
