import type { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme, toSecondaryColor }: WfoThemeHelpers) => {
    const expandIconContainerStyle = {
        cursor: 'pointer',
    };

    const treeContainerStyle = {
        width: 0,
        marginTop: theme.size.s,
        marginRight: `-${theme.size.s}`,
    };

    const treeItemStyle = (isOutsideCurrentSubscription: boolean) => {
        return {
            cursor: 'pointer',
            paddingBlock: theme.size.xs,
            paddingInline: theme.size.s,
            borderRadius: theme.base - 10,
            textDecoration: 'none',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s ease, text-decoration 0.3s ease', // Smooth transition for background
            '&:hover': {
                textDecoration: 'underline',
            },
            border: isOutsideCurrentSubscription
                ? `1px dashed ${theme.colors.borderBaseSubdued}`
                : 'none',
        };
    };

    const selectedTreeItemStyle = (isOutsideCurrentSubscription: boolean) => {
        return {
            ...treeItemStyle(isOutsideCurrentSubscription),
            backgroundColor: isOutsideCurrentSubscription
                ? theme.colors.borderBaseSubdued
                : toSecondaryColor(theme.colors.primary),
            color: theme.colors.textPrimary,
        };
    };

    return {
        expandIconContainerStyle: expandIconContainerStyle,
        treeContainerStyle: treeContainerStyle,
        selectedTreeItemStyle,
        treeItemStyle,
    };
};
