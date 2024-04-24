import { WfoTheme, useOrchestratorTheme } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (wfoTheme: WfoTheme) => T,
) {
    return getStylesFunction(useOrchestratorTheme());
}
