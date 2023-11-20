import { EuiThemeComputed } from '@elastic/eui';

import { useOrchestratorTheme } from './useOrchestratorTheme';

export function useWithOrchestratorTheme<T>(
    getStylesFunction: (theme: EuiThemeComputed) => T,
) {
    const { theme } = useOrchestratorTheme();
    return getStylesFunction(theme);
}
