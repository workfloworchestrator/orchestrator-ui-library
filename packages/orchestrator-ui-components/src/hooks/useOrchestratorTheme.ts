import { EuiThemeColorMode, shade, tint, useEuiTheme } from '@elastic/eui';

import { WfoComputedModifications, WfoComputedTheme } from '@/theme';
import { ColorModes } from '@/types';

export type WfoThemeHelpers = Readonly<{
  theme: WfoComputedTheme;
  multiplyByBaseUnit: (multiplier: number) => number;
  toSecondaryColor: (color: string) => string;
  colorMode: EuiThemeColorMode;
  isDarkModeActive: boolean;
}>;

export const shadeOrchestratorColor = (color: string) => shade(color, 0.65).toString();
export const tintOrchestratorColor = (color: string) => tint(color, 0.8).toString();

export const useOrchestratorTheme = (): WfoThemeHelpers => {
  const { euiTheme, colorMode } = useEuiTheme<WfoComputedModifications>();
  const isDarkModeActive = colorMode === ColorModes.DARK;

  const baseUnit = euiTheme.base;

  const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

  const toSecondaryColor = (color: string) =>
    isDarkModeActive ? shadeOrchestratorColor(color) : tintOrchestratorColor(color);

  return {
    theme: euiTheme,
    multiplyByBaseUnit,
    toSecondaryColor,
    colorMode,
    isDarkModeActive,
  };
};
