import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { WfoTheme } from '@/hooks';

export const getSelectFieldStyles = (wfoTheme: WfoTheme) => {
    const { theme } = wfoTheme;
    const { formRowStyle } = getCommonFormFieldStyles(wfoTheme);

    const reactSelectInnerComponentStyles = {
        option: (
            baseStyles: object,
            state: { isSelected: boolean; isDisabled: boolean },
        ) => ({
            ...baseStyles,
            borderBottom: theme.border.thin,
            borderColor: theme.colors.lightShade,
            backgroundColor: theme.colors.lightestShade,
            color: state.isSelected
                ? theme.colors.primaryText
                : theme.colors.text,
        }),
        control: (baseStyles: object, state: { isFocused: boolean }) => {
            return {
                ...baseStyles,
                backgroundColor: state.isFocused
                    ? theme.colors.emptyShade
                    : theme.colors.lightestShade,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.lightShade}`,
            };
        },
        input: (baseStyles: object) => ({
            ...baseStyles,
            color: theme.colors.text,
        }),
        singleValue: (baseStyles: object, state: { isDisabled: boolean }) => {
            const opacity = state.isDisabled ? 0.3 : 1;
            const transition = 'opacity 300ms';
            return {
                ...baseStyles,
                opacity,
                transition,
                color: theme.colors.text,
            };
        },
        menu: (baseStyles: object) => ({
            ...baseStyles,
            backgroundColor: theme.colors.lightestShade,
        }),
    };

    return { reactSelectInnerComponentStyles, formRowStyle };
};
