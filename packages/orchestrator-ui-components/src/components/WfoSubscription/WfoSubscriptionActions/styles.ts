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

    const linkMenuItemStyle = css({
        '&>:hover': {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const tooltipMenuItemStyle = css([
        linkMenuItemStyle,
        {
            '& > *': {
                display: 'block',
            },
        },
    ]);

    const disabledIconStyle = css({
        display: 'flex',
        width: theme.base * 2,
    });

    const iconStyle = css({
        width: theme.base * 2,
    });

    const secondaryIconStyle = css({
        transform: 'translate(-11px, -8px);',
    });

    return {
        expandableMenuItemStyle,
        expandButtonStyle,
        expandedContentStyle,
        linkStyle,
        linkMenuItemStyle,
        tooltipMenuItemStyle,
        disabledIconStyle,
        iconStyle,
        secondaryIconStyle,
    };
};