import { WfoTheme } from '@/hooks';

export const getReactSelectInnerComponentStyles = ({ theme }: WfoTheme) => {
    const reactSelectInnerComponentStyles = {
        option: (
            baseStyles: object,
            state: { isSelected: boolean; isDisabled: boolean },
        ) => ({
            ...baseStyles,
            borderBottom: theme.border.thin,
            backgroundColor: theme.colors.lightestShade,
            color: state.isSelected
                ? theme.colors.primaryText
                : theme.colors.text,
        }),
        control: (baseStyles: object) => {
            return {
                ...baseStyles,
                backgroundColor: theme.colors.lightestShade,
                color: theme.colors.text,
                border: theme.border.thin,
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

    return reactSelectInnerComponentStyles;
};
