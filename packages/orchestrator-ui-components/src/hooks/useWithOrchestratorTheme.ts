import { useOrchestratorTheme } from './useOrchestratorTheme';
import type { WfoThemeHelpers } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (wfoThemeHelpers: WfoThemeHelpers) => T,
) {
    const wfoThemeHelpers = useOrchestratorTheme();
    return getStylesFunction(wfoThemeHelpers);
}
