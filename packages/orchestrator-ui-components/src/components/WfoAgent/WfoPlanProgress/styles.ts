import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoPlanProgressStyles = ({ theme }: WfoThemeHelpers) => {
    const iconSize = 14;

    const containerStyle = css({
        maxWidth: '50%',
        marginRight: 'auto',
        marginBottom: theme.size.s,
        fontSize: theme.size.m,
    });

    const headerStyle = css({
        display: 'flex',
        alignItems: 'center',
        gap: theme.size.s,
        paddingBottom: theme.size.s,
        marginBottom: theme.size.xs,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.borderBaseSubdued}`,
        fontWeight: theme.font.weight.semiBold,
    });

    const rowStyle = css({
        display: 'flex',
        alignItems: 'center',
        gap: theme.size.s,
        padding: `${theme.size.xxs} 0`,
    });

    const reasoningStyle = css({
        marginLeft: `calc(${iconSize}px + ${theme.size.s})`,
    });

    const toolCallsToggleStyle = css({
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.size.xxs,
        cursor: 'pointer',
        fontSize: theme.size.s,
        color: theme.colors.textSubdued,
        marginLeft: 'auto',
        '&:hover': {
            color: theme.colors.textParagraph,
        },
    });

    const toolCallsListStyle = css({
        paddingLeft: `calc(${iconSize}px + ${theme.size.s})`,
    });

    return {
        containerStyle,
        headerStyle,
        rowStyle,
        reasoningStyle,
        toolCallsToggleStyle,
        toolCallsListStyle,
        iconSize,
    };
};
