import { tint, useEuiTheme } from '@elastic/eui';

export const useOrchestratorTheme = () => {
    const { euiTheme } = useEuiTheme();
    const baseUnit = euiTheme.base;

    const multiplyByBaseUnit = (multiplier: number) => baseUnit * multiplier;

    const toSecondaryColor = (color: string) => tint(color, 0.8);

    const toStatusColorFieldColor = (color: string) => tint(color, 0.3);

    return {
        theme: euiTheme,
        multiplyByBaseUnit,
        toSecondaryColor,
        toStatusColorFieldColor,
    };
};
