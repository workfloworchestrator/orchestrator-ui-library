import { WfoTheme, useOrchestratorTheme } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (theme: WfoTheme) => T,
) {
    const { theme } = useOrchestratorTheme();
    return getStylesFunction(theme);
}
