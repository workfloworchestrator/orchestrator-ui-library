import {
    EuiThemeColorModeStandard,
    shade,
    tint,
    useEuiTheme,
} from '@elastic/eui';

import { WfoThemeComputed } from '@/theme';
import { ColorModes } from '@/types';

export type WfoTheme = {
    theme: WfoThemeComputed;
    multiplyByBaseUnit: (multiplier: number) => number;
    toSecondaryColor: (color: string) => string;
    colorMode: EuiThemeColorModeStandard;
    isDarkThemeActive: boolean;
};

export const useOrchestratorTheme = (): WfoTheme => {
    const { euiTheme, colorMode } = useEuiTheme<WfoThemeComputed>();
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
