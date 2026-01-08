import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

const EXPANDED_CONTENT_LEFT_MARGIN = '52px';

export const getSubscriptionActionStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const clickableStyle = css({
        '&:hover, & :hover': {
            cursor: 'pointer',
        },
    });

    const expandableMenuItemStyle = css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
            backgroundColor: theme.colors.backgroundBasePlain,
            borderRadius: theme.border.radius.medium,
            cursor: 'pointer',
        },
        '.euiToolTipAnchor': {
            width: '100%',
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
        position: 'absolute',
        transform: 'translate(13px, -8px);',
    });

    const spinnerSecondaryIconStyle = css({
        transform: 'translate(-8px, -6px);',
    });

    const disabledTextStyle = css({
        color: theme.colors.textDisabled,
    });

    return {
        clickableStyle,
        expandableMenuItemStyle,
        expandButtonStyle,
        expandedContentStyle,
        linkStyle,
        linkMenuItemStyle,
        tooltipMenuItemStyle,
        disabledIconStyle,
        iconStyle,
        secondaryIconStyle,
        disabledTextStyle,
        spinnerSecondaryIconStyle,
    };
};
