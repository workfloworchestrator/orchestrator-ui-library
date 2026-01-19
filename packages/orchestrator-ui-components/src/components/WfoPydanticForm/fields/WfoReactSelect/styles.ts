import { css } from '@emotion/react';

import type { WfoThemeHelpers } from '@/hooks';

export const getWfoReactSelectStyles = (wfoTheme: WfoThemeHelpers) => {
    const { theme } = wfoTheme;

    const reactSelectInnerComponentStyles = {
        option: (
            baseStyles: object,
            state: { isSelected: boolean; isDisabled: boolean },
        ) => ({
            ...baseStyles,
            borderBottom: theme.border.thin,
            borderColor: theme.colors.borderBaseSubdued,
            backgroundColor: theme.colors.backgroundBaseSubdued,
            color: state.isSelected
                ? theme.colors.textPrimary
                : theme.colors.textParagraph,
        }),
        control: (baseStyles: object, state: { isFocused: boolean }) => {
            return {
                ...baseStyles,
                backgroundColor: state.isFocused
                    ? theme.colors.backgroundBaseNeutral
                    : theme.colors.backgroundBaseSubdued,
                color: theme.colors.textParagraph,
                border: `1px solid ${theme.colors.borderBaseSubdued}`,
                borderColor: 'none',
                '&:hover': {
                    borderColor: 'none',
                },
            };
        },
        input: (baseStyles: object) => ({
            ...baseStyles,
            color: theme.colors.textParagraph,
        }),
        singleValue: (baseStyles: object, state: { isDisabled: boolean }) => {
            const opacity = state.isDisabled ? 0.6 : 1;
            const transition = 'opacity 300ms';
            return {
                ...baseStyles,
                opacity,
                transition,
                color: theme.colors.textParagraph,
            };
        },
        menu: (baseStyles: object) => ({
            ...baseStyles,
            backgroundColor: theme.colors.backgroundBasePlain,
        }),
    };

    const containerStyle = css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    });

    const reactSelectStyle = css({
        width: '100%',
    });
    const refreshButtonStyle = css({
        marginRight: theme.base / 2,
        cursor: 'pointer',
    });
    return {
        reactSelectInnerComponentStyles,
        refreshButtonStyle,
        containerStyle,
        reactSelectStyle,
    };
};
