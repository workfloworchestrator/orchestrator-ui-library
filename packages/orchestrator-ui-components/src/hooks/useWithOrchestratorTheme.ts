import { useOrchestratorTheme } from './useOrchestratorTheme';
import type { WfoTheme } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (theme: WfoTheme) => T,
) {
    const wfoTheme = useOrchestratorTheme();
    return getStylesFunction(wfoTheme);
}
