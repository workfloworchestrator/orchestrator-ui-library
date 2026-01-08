import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getFilterDisplayStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const wrapStyle = css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.size.s,
    });

    const columnGroupWrapStyle = css({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.size.s,
        alignItems: 'flex-start',
    });

    const chipStyle = css({
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: theme.size.xl,
        border: `1px solid ${theme.border.color}`,
        backgroundColor: theme.colors.backgroundBasePlain,
        padding: `${theme.size.s} ${theme.size.m}`,
        lineHeight: 1.1,
        gap: theme.size.s,
    });

    const groupStyle = css({
        border: `1px solid ${theme.colors.borderBaseSubdued}`,
        borderRadius: theme.border.radius.medium,
        padding: theme.size.s,
        margin: theme.size.xs,
        backgroundColor: theme.colors.backgroundBasePlain,
    });

    const operatorStyle = css({
        fontFamily: theme.font.familyCode,
        padding: `${theme.size.xs}px ${theme.size.s}px`,
        borderRadius: theme.size.s,
        backgroundColor: theme.colors.primary,
        color: theme.colors.ghost,
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.bold,
        margin: `${theme.size.xs} 0`,
    });

    const valueStyle = css({
        fontWeight: theme.font.weight.semiBold,
        color: theme.colors.warning,
    });

    return {
        wrapStyle,
        columnGroupWrapStyle,
        chipStyle,
        groupStyle,
        operatorStyle,
        valueStyle,
    };
};
