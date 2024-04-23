import { shade, tint, useEuiTheme } from '@elastic/eui';

import { ColorModes } from '@/types';

export const useOrchestratorTheme = () => {
    const { euiTheme, colorMode } = useEuiTheme();
    const isDarkThemeActive = colorMode === ColorModes.DARK;

    const baseUnit = euiTheme.base;

    const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

    const toSecondaryColor = (color: string) =>
        isDarkThemeActive ? shade(color, 0.65) : tint(color, 0.8);

    return {
        theme: euiTheme,
        multiplyByBaseUnit,
        toSecondaryColor,
        colorMode,
        isDarkThemeActive,
    };
};
