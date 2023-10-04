import { getNumberValueFromEnvironmentVariable } from './environmentVariables';

describe('getNumberValueFromEnvironmentVariable', () => {
    it('returns the string as a number if it is a number', () => {
        const result = getNumberValueFromEnvironmentVariable('123', 987);
        expect(result).toBe(123);
    });

    it('returns the default value if the environment variable is not defined', () => {
        const result = getNumberValueFromEnvironmentVariable(undefined, 987);
        expect(result).toBe(987);
    });
    it('returns the default value if the environment variable is not a number', () => {
        const result = getNumberValueFromEnvironmentVariable('abc', 987);
        expect(result).toBe(987);
    });
});
