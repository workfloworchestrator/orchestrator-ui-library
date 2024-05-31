import process from 'process';

// By convention, only this function should be used to access the process.env object.
// It trows an error if any of variables is not set
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

    // Todo: Try preventing to get environment variables in the browser. This code should only run on the Node side.
    // https://github.com/workfloworchestrator/orchestrator-ui-library/issues/1108
    if (
        typeof window === 'undefined' &&
        missingEnvironmentVariables.length > 0
    ) {
        // eslint-disable-next-line no-console
        console.warn(
            `Warning: Missing required environment variables: ${missingEnvironmentVariables.join(', ')}`,
        );
    }

    return environmentVariablesWithValues;
}
