import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getToolProgressStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const containerStyle = css({
        border: `${theme.border.width.thin} solid ${theme.colors.lightShade}`,
        borderRadius: theme.border.radius.medium,
        backgroundColor: theme.colors.emptyShade,
        transition: `all ${theme.animation.normal} ease`,
        maxWidth: '50%',
        marginRight: 'auto',
    });

    const containerClickableStyle = css({
        cursor: 'pointer',
        '&:hover': {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const headerStyle = css({
        padding: `${theme.size.base} ${theme.size.l}`,
    });

    const nameStyle = css({
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.medium,
    });

    const expandedContentStyle = css({
        borderTop: `${theme.border.width.thin} solid ${theme.colors.lightShade}`,
        padding: `${theme.size.base} ${theme.size.l}`,
    });

    const iconSize = 18;

    const iconStyle = css({
        color: theme.colors.subduedText,
    });

    return {
        containerStyle,
        containerClickableStyle,
        headerStyle,
        nameStyle,
        expandedContentStyle,
        iconSize,
        iconStyle,
    };
};
