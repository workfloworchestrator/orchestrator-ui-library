import { EuiThemeColorMode, shade, tint, useEuiTheme } from '@elastic/eui';

import { WfoComputedModifications, WfoComputedTheme } from '@/theme';
import { ColorModes } from '@/types';

export type UseOrchestratorThemeProps = {
    theme: WfoComputedTheme;
    multiplyByBaseUnit: (multiplier: number) => number;
    toSecondaryColor: (color: string) => string;
    colorMode: EuiThemeColorMode;
    isDarkModeActive: boolean;
};

export const useOrchestratorTheme = (): UseOrchestratorThemeProps => {
    const { euiTheme, colorMode } = useEuiTheme<WfoComputedModifications>();
    const isDarkModeActive = colorMode === ColorModes.DARK;

    const baseUnit = euiTheme.base;

    const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

    const toSecondaryColor = (color: string) =>
        isDarkModeActive ? shade(color, 0.65) : tint(color, 0.8);

    return {
        theme: euiTheme,
        multiplyByBaseUnit,
        toSecondaryColor,
        colorMode,
        isDarkModeActive,
    };
};
