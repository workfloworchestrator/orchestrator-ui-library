import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoSummaryCardListStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const listContainerStyle = css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        borderColor: theme.colors.lightShade,
    });

    const listHeaderStyle = css({
        fontWeight: theme.font.weight.semiBold,
    });

    const listStyle = css({
        height: theme.base * 20,
        overflow: 'auto',
    });

    const listItemContainerStyle = css({
        paddingBlock: theme.size.m,
        '.highlight-icon': {
            visibility: 'hidden',
        },
        '&:hover .highlight-icon': {
            visibility: 'visible',
        },
    });

    const listItemTitleStyle = css({
        fontWeight: theme.font.weight.medium,
    });

    const listItemSubtitleStyle = css({
        fontWeight: theme.font.weight.regular,
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
