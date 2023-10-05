export const getNumberValueFromEnvironmentVariable = (
    environmentVariable: string | undefined,
    defaultValue: number,
) => {
    if (!environmentVariable) {
        return defaultValue;
    }

    const valueAsNumber = parseInt(environmentVariable);

    return isNaN(valueAsNumber) ? defaultValue : valueAsNumber;
};
