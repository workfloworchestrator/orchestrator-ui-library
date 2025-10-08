import process from 'process';

// By convention, only this function should be used to access the process.env object.
// It logs a warning if one or more variables are not set
export function getEnvironmentVariables<T>(
    envVars: (keyof T)[],
): Record<keyof T, string> {
    const missingEnvironmentVariables: string[] = [];

    const environmentVariablesWithValues = envVars.reduce(
        (acc, currentKey) => {
            const value = process.env[currentKey.toString()];

            if (value === undefined) {
                missingEnvironmentVariables.push(currentKey.toString());
            }

            return {
                ...acc,
                [currentKey]: value || '',
            };
        },
        {} as Record<keyof T, string>,
    );

    if (missingEnvironmentVariables.length > 0) {
        console.warn(
            `Warning: Missing required environment variables: ${missingEnvironmentVariables.join(
                ', ',
            )}`,
        );
    }

    return environmentVariablesWithValues;
}
