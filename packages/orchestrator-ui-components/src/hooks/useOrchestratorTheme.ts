import { tint, useEuiTheme } from '@elastic/eui';

export const useOrchestratorTheme = () => {
    const { euiTheme, colorMode } = useEuiTheme();

    const baseUnit = euiTheme.base;

    const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

    // Todo use shade() to mix with black for secondary color
    const toSecondaryColor = (color: string) => tint(color, 0.8);

    return {
        theme: euiTheme,
        multiplyByBaseUnit,
        toSecondaryColor,
        colorMode,
    };
};
