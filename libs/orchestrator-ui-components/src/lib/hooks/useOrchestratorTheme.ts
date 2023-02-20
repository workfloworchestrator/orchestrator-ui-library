import { useEuiTheme } from '@elastic/eui';

export const useOrchestratorTheme = () => {
    const { euiTheme } = useEuiTheme();
    const baseUnit = euiTheme.base;

    const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

    return {
        theme: euiTheme,
        multiplyByBaseUnit,
    };
};
