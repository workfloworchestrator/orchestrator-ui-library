import type { WfoTheme } from '@/hooks';

export const getStyles = (wfoTheme: WfoTheme) => {
    const { theme, toSecondaryColor } = wfoTheme;
    const expandIconContainerStyle = {
        cursor: 'pointer',
    };

    const treeContainerStyle = {
        width: 0,
        marginTop: theme.size.s,
        marginRight: `-${theme.size.s}`,
    };

    const treeItemOutsideSubscriptionBoundaryStyle = {
        backgroundColor: toSecondaryColor(theme.colors.lightestShade),
        border: `thin dashed ${theme.colors.lightShade}`,
    };

    return {
        expandIconContainerStyle: expandIconContainerStyle,
        treeContainerStyle: treeContainerStyle,
        treeItemOutsideSubscriptionBoundaryStyle,
    };
};
