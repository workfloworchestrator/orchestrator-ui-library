import process from 'process';

import { getEnvironmentVariables } from './getEnvironmentVariables';

const originalEnv = process.env;

describe('getEnvironmentVariables()', () => {
    const warnMock = jest.spyOn(console, 'warn');

    jest.mock('process');

    beforeEach(() => {
        process.env = {
            ...originalEnv,
        };
        jest.resetAllMocks();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('returns an object with the environment variables and its values', () => {
        process.env.test01 = 'value01';
        process.env.test02 = 'value02';

        const result = getEnvironmentVariables(['test01', 'test02']);

        expect(warnMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            test01: 'value01',
            test02: 'value02',
        });
    });

    it('returns an empty string as value in the result when the environment variable is not set', () => {
        process.env.test01 = 'value01';
        process.env.test03 = 'value03';

        const result = getEnvironmentVariables(['test01', 'test02', 'test03']);

        expect(warnMock).toHaveBeenCalledWith(
            'Warning: Missing required environment variables: test02',
        );
        expect(result).toEqual({
            test01: 'value01',
            test02: '',
            test03: 'value03',
        });
    });
});
