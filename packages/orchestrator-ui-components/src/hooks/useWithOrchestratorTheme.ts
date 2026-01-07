import { useOrchestratorTheme } from './useOrchestratorTheme';
import type { UseOrchestratorThemeProps } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (
        useOrchestratorThemeProps: UseOrchestratorThemeProps,
    ) => T,
) {
    const useOrchestratorThemeProps = useOrchestratorTheme();
    return getStylesFunction(useOrchestratorThemeProps);
}
